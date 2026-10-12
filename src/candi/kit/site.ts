import { Group, InstancedMesh, Mesh, type BufferGeometry, type Material, type Matrix4, type Object3D } from "three";
import { MeshBuilder } from "../../render/mesh-builder";
import {
  createStoneMaterials,
  type Fabric,
  type StoneMaterialKey,
  type StoneMaterials,
  type StoneTextures,
} from "../../render/stone";
import type { CandiModel, Realm } from "../types";

export const REALM_TINT: Record<Realm, string> = {
  lower: "#c27b5c",
  middle: "#d8b250",
  upper: "#8fb7d6",
};

const REALMS: readonly Realm[] = ["lower", "middle", "upper"];

/** Keys whose UVs are laid out explicitly (panels, lattices) and must survive re-projection. */
const EXPLICIT_UV = new Set<StoneMaterialKey>(["reliefDouble", "reliefSingle", "latticeDiamond", "latticeSquare"]);

export interface Part {
  realm: Realm;
  key: StoneMaterialKey;
  geometry: BufferGeometry;
}

/** One MeshBuilder per realm × material, built into a list of geometry parts. */
export class Parts {
  private readonly builders = new Map<string, { realm: Realm; key: StoneMaterialKey; builder: MeshBuilder }>();

  get(realm: Realm, key: StoneMaterialKey): MeshBuilder {
    const id = `${realm}:${key}`;
    let entry = this.builders.get(id);
    if (!entry) {
      entry = { realm, key, builder: new MeshBuilder() };
      this.builders.set(id, entry);
    }
    return entry.builder;
  }

  /** Merge pre-built parts at `matrix` (world-projected UVs are recomputed so masonry stays continuous). */
  place(parts: readonly Part[], matrix: Matrix4): void {
    for (const p of parts) this.get(p.realm, p.key).geometry(p.geometry, matrix, EXPLICIT_UV.has(p.key));
  }

  build(): Part[] {
    return [...this.builders.values()].filter((e) => !e.builder.empty).map((e) => ({ realm: e.realm, key: e.key, geometry: e.builder.build() }));
  }
}

/**
 * Assembles a whole site: merged meshes for unique structures, instanced meshes for repeated
 * shrines, one material set per realm so the overlay can tint them.
 */
export class Site extends Parts {
  readonly group = new Group();
  readonly collidables: Object3D[] = [];
  private readonly materials: Record<Realm, StoneMaterials>;

  constructor(name: string, textures: StoneTextures, fabric: Fabric = "andesite") {
    super();
    this.group.name = name;
    this.materials = {
      lower: createStoneMaterials(textures, fabric),
      middle: createStoneMaterials(textures, fabric),
      upper: createStoneMaterials(textures, fabric),
    };
  }

  material(realm: Realm, key: StoneMaterialKey): Material {
    return this.materials[realm][key];
  }

  /** Repeat pre-built parts as instanced meshes, one draw call per part. */
  instance(parts: readonly Part[], matrices: readonly Matrix4[], collide = true): void {
    if (matrices.length === 0) return;
    for (const p of parts) this.instanceGeometry(p.geometry, this.materials[p.realm][p.key], matrices, collide && p.key !== "statue");
  }

  instanceGeometry(geometry: BufferGeometry, material: Material, matrices: readonly Matrix4[], collide: boolean): void {
    const mesh = new InstancedMesh(geometry, material, matrices.length);
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    if (collide) this.collidables.push(mesh);
  }

  /** Merge every builder into meshes and hand back the realm overlay. */
  finish(): Pick<CandiModel, "group" | "collidables" | "setRealmHighlight"> {
    for (const { realm, key, geometry } of this.build()) {
      const mesh = new Mesh(geometry, this.materials[realm][key]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.name = `${realm}:${key}`;
      this.group.add(mesh);
      // Statues are small and ornate; walking into them is no loss and keeps the BVH lean.
      if (key !== "statue") this.collidables.push(mesh);
    }
    const base = new Map<Material, string>();
    for (const set of Object.values(this.materials)) {
      for (const m of Object.values(set)) base.set(m, `#${m.color.getHexString()}`);
    }
    const materials = this.materials;
    return {
      group: this.group,
      collidables: this.collidables,
      setRealmHighlight(on) {
        for (const realm of REALMS) {
          for (const [key, m] of Object.entries(materials[realm])) {
            if (key === "nicheShadow" || key === "water") continue;
            m.color.set(on ? REALM_TINT[realm] : base.get(m)!);
          }
        }
      },
    };
  }
}
