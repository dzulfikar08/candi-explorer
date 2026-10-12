import type { Group, Object3D, Vector3 } from "three";
import type { StoneTextures } from "../render/stone";

export interface Topic {
  kicker: string;
  title: string;
  paragraphs: string[];
  facts?: [label: string, value: string][];
}

export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

export interface Hotspot {
  topic: string;
  label: string;
  /** Marker anchor in world space. */
  anchor: [number, number, number];
  view: CameraView;
}

/** A distant landmark drawn on the horizon at its true bearing and angular height. */
export interface HorizonFeature {
  name: string;
  lat: number;
  lon: number;
  /** Summit height above the temple's ground level, metres. */
  relativeHeight: number;
  kind: "volcano" | "ridge";
}

export interface TourSection {
  topic: string;
  label: string;
  /** Eye positions along the walk, in order. */
  points: Vector3[];
  /** Yaw offset (radians, positive = right) so the camera favours the walls on the pilgrim's right. */
  lookRight: number;
}

/**
 * Javanese temples read bottom to top as three cosmological zones: Kamadhatu / Rupadhatu /
 * Arupadhatu in Buddhist terms, Bhurloka / Bhuvarloka / Svarloka (foot, body, roof) in Hindu ones.
 */
export type Realm = "lower" | "middle" | "upper";

export interface CandiModel {
  group: Group;
  /** Meshes the walking camera collides with and hotspots test occlusion against. */
  collidables: Object3D[];
  setRealmHighlight(on: boolean): void;
  tour: TourSection[];
  walkSpawn: { position: Vector3; yaw: number };
}

export interface CandiDefinition {
  id: string;
  name: string;
  location: string;
  site: { lat: number; lon: number };
  overviewTopic: string;
  topics: Record<string, Topic>;
  hotspots: Hotspot[];
  horizon: HorizonFeature[];
  orbit: CameraView;
  /** Legend for the three-realm overlay, bottom zone first. */
  realms: Record<Realm, string>;
  setting: {
    /** Ground stays flat (and treeless) out to this radius, metres. */
    plazaRadius: number;
    /** Half width of the sun's shadow frustum; covers the main structures. */
    shadowExtent: number;
    /** Approach road: unit vector out from the monument (+x east, +z south) and where it starts. */
    approach: { x: number; z: number; start: number };
    /**
     * Sunken court centred on the origin (Sambisari lies below today's ground): the terrain gets a
     * rectangular hole of this size and the site builds its walls and floor.
     */
    pit?: { halfX: number; halfZ: number };
  };
  build(textures: StoneTextures): CandiModel;
}
