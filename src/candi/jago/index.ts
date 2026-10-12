import type { StoneTextures } from "../../render/stone";
import type { CandiDefinition, Topic } from "../types";
import { buildJago } from "./model";

/**
 * Sources:
 * - Wikipedia "Jago Temple" (en): 13th-century Singhasari temple about 22 km from Malang; the
 *   Nagarakretagama calls it Jajaghu ("majestic") and lists it among the sanctuaries Hayam Wuruk
 *   visited on his royal tour; king Vishnuvardhana deified here; reliefs of Kunjarakarna,
 *   Parthayajna, Arjunavivaha and Krishnayana; the name of Adityawarman appears in 1343 on a
 *   Manjusri image; more reliefs than at Kidal or Singhasari. Coordinates 8°00'20.8"S 112°45'50.8"E.
 * - Wikipedia "Candi Jago" (id): Tantrayana Buddhist; the Amoghapasa image is the deified
 *   Wisnuwardhana; built on Kertanegara's orders 1268–1280 for his father Sri Jaya Wisnuwardhana,
 *   who died in 1268; stepped-pyramid (punden berundak) form, 23.71 m long, 14 m wide, 9.97 m
 *   surviving height; three terraces carry the body, the front projects, the body stands on the
 *   third terrace; roof and part of the body lost, local tradition blames a lightning strike, and
 *   the roof is guessed to have been a wooden meru or pagoda; andesite; relief stories per level
 *   (Tantri from the north-west corner, Kunjarakarna from the north-east, turtle-and-geese fable
 *   on the west front, Arjunawiwaha on the third terrace, Kalayawana on the body walls);
 *   Adityawarman's 1343 restoration and Manjusri statue (Museum Nasional D.214); first published
 *   by Raffles in the History of Java, Brandes' monograph of 1904.
 * - tirto.id, Dicky Setyawan (2023): faces west, with stair flights between the terrace levels;
 *   the body survives to the door threshold only; Wisnuwardhana reigned c. 1248–1268 in the
 *   Shiva-Buddha (Siwa Buddha) current; story bands by terrace (Tantri Kamandaka and Kunjarakarna
 *   lowest, Parthayajna and Arjunawiwaha middle, Arjunawiwaha on the third, Kalayawana on the
 *   body); a giant lotus pedestal about 1 m across stands 6 m west of the foot; the headless
 *   eight-armed Amoghapasa and an ogre head were found in the yard.
 * - Wikipedia "Candi Kidal" (id): prasawiya (counter-clockwise) relief reading at the
 *   neighbouring Tumpang temple; the direction at Jago is stated differently by en- (counter-
 *   clockwise) and id-Wikipedia (clockwise), so the topic text leaves the direction open.
 * - Horizon: summit coordinates from Wikipedia (Semeru, Arjuno-Welirang, Kelud, Bromo) and
 *   OpenStreetMap (Kawi), heights from published summit elevations, checked against SRTM 30 m
 *   samples; the site itself sits at about 613 m (SRTM 30 m).
 *
 * Simplifications: the terraces are plain oblong blocks (the real west stair bay projects a
 * little); the ragged broken top of the body is drawn level; the relief carving is the kit's
 * stylised panel pattern, not the actual stories; the lost superstructure is not reconstructed.
 */
const topics: Record<string, Topic> = {
  overview: {
    kicker: "Tumpang, East Java · 1268–1280 CE",
    title: "Candi Jago",
    paragraphs: [
      "A Buddhist temple of the Singhasari kingdom in the village of Tumpang, about 22 km east of Malang. The Nagarakretagama, the old court poem of Majapahit, calls it Jajaghu, 'the majestic', and counts it among the sanctuaries King Hayam Wuruk visited on his tour of East Java in 1359.",
      "It is a memorial shrine. Kertanegara, the last king of Singhasari, had it built for his father Wisnuwardhana, who died in 1268, with work continuing until about 1280. Wisnuwardhana belonged to the Shiva-Buddha current of the age, and the temple honoured him in the form of Amoghapasa, a Tantric form of the bodhisattva Avalokitesvara.",
      "The building is a stepped pyramid of andesite: three terraces whose walls carry dense narrative reliefs, each level set back a little further to the east, with the body of the temple standing at the rear of the topmost one. The roof and most of the body are lost; what survives rises 9.97 m on a base 23.71 m long and 14 m deep, and it faces west.",
      "This model is procedural: the terrace sizes follow the published ground plan, the relief carving is a stylised pattern, and the broken top of the body is drawn level.",
    ],
    facts: [
      ["Base", "23.71 × 14 m"],
      ["Surviving height", "9.97 m"],
      ["Built", "1268–1280 CE"],
      ["Faces", "West"],
      ["Stone", "Andesite"],
      ["Memorial of", "Wisnuwardhana (d. 1268)"],
    ],
  },
  terraces: {
    kicker: "The stepped base",
    title: "Three terraces, stairs on the west",
    paragraphs: [
      "Jago takes the old Indonesian form of the stepped sanctuary, a punden berundak. The west front, where the stairways climb level by level, is the long side of the plan, and every terrace above recedes toward the east, so the building leans back over its own courtyards.",
      "The upper body was destroyed long ago; local tradition says lightning struck it. The walls now end just above the doorway, keeping the threshold of the chamber, and nothing stands on the third terrace except this fragment.",
      "No one knows what crowned the building. The usual suggestion is a tall superstructure of stacked wooden roofs, like the meru shrines of later Bali or a pagoda; the sources guess wood covered with black ijuk fibre. Nothing of it survives, so this model leaves the top open rather than inventing a shape.",
    ],
    facts: [
      ["Terraces", "3, set back toward the east"],
      ["Stairs", "West side, flights between levels"],
      ["Surviving body", "9.97 m, with the door threshold"],
      ["Lost roof", "Likely a wooden meru"],
    ],
  },
  reliefs: {
    kicker: "The stone storybook",
    title: "Reliefs on every wall",
    paragraphs: [
      "More carved panels survive at Jago than at Kidal or Singhasari, running in bands around every terrace wall and up onto the body. The lowest terrace carries the Tantri animal fables of the Pancatantra, beginning at the north-west corner, and the Buddhist tale of the ogre Kunjarakarna, who is shown the torments of hell by the Buddha Wairocana before earning rebirth as a man.",
      "On the west front, beside the stairs, is the fable of the tortoise carried through the air by two geese: warned to keep silent, he opens his mouth all the same, falls, and is eaten by wolves. The middle and third terraces continue with Mahabharata stories, Parthayajna and Arjunawiwaha, Arjuna's marriage to the nymph Suprabha after he defeats the ogre Niwatakawaca.",
      "On the surviving body walls, battle scenes of Krishna against the king Kalayawana close the sequence. The carving here is a stylised stand-in for the real panels; walking the terraces shows where each story runs.",
    ],
    facts: [
      ["Lowest terrace", "Tantri fables · Kunjarakarna"],
      ["Second and third", "Parthayajna · Arjunawiwaha"],
      ["Body walls", "Krishna and Kalayawana"],
      ["West front", "The tortoise and the geese"],
    ],
  },
  kingdom: {
    kicker: "Siwa-Buddha Singhasari",
    title: "A king honoured as Amoghapasa",
    paragraphs: [
      "Wisnuwardhana reigned at Singhasari from about 1248 until his death in 1268, in the Shiva-Buddha current that let one king be honoured in both faiths at once. His memorial image at Jago was Amoghapasa, the Tantric form of Avalokitesvara, and his son Kertanegara was the last king of the dynasty.",
      "A century later the temple still drew the court. The Nagarakretagama records Hayam Wuruk's visit of 1359, and a Manjusri statue placed at Jago bears an inscription dated 1343 with the name of Adityawarman, the future king of the Melayu realm in Sumatra. That statue is now in the National Museum of Indonesia, inventory D.214.",
    ],
    facts: [
      ["Wisnuwardhana", "Reigned c. 1248–1268"],
      ["Memorial image", "Amoghapasa Lokeshvara"],
      ["Royal visitor", "Hayam Wuruk, 1359"],
      ["Manjusri statue", "Placed by Adityawarman, 1343"],
    ],
  },
  relics: {
    kicker: "In the yard",
    title: "Pedestals and rediscovery",
    paragraphs: [
      "On the lawn west of the terraces stands a giant stone lotus pedestal about a metre across, six metres from the foot of the temple, the kind of base that carried a free-standing image. The yard also held the great eight-armed Amoghapasa on a throne of ogre heads, headless today, and a separate ogre head nearby.",
      "Raffles published the ruin in his History of Java, and it was recorded through the colonial century by Friederich, Brumund, Fergusson and Veth, before J.L.A. Brandes issued his monograph of Jago in 1904.",
    ],
    facts: [
      ["Lotus pedestal", "≈ 1 m across, 6 m west"],
      ["Amoghapasa", "Eight arms, headless"],
      ["First publication", "Raffles, History of Java"],
      ["Brandes monograph", "1904"],
    ],
  },
};

export const jago: CandiDefinition = {
  id: "jago",
  name: "Jago",
  location: "Malang, Jawa Timur",
  site: { lat: -8.0057806, lon: 112.7641167 },
  overviewTopic: "overview",
  topics,
  hotspots: [
    { topic: "terraces", label: "Stepped west front", anchor: [-7.1, 1.5, -2], view: { position: [-30, 9, -16], target: [-4, 5, 0] } },
    { topic: "reliefs", label: "Tantri fables", anchor: [-6, 1.5, -11.9], view: { position: [-12, 3.2, -21], target: [-5.5, 1.8, -11.5] } },
    { topic: "reliefs", label: "Parthayajna band", anchor: [0.6, 4, -8.5], view: { position: [-7, 6.5, -16], target: [0.6, 4.2, -8.2] } },
    { topic: "reliefs", label: "Arjunawiwaha band", anchor: [1.2, 6.3, -6.3], view: { position: [-5, 9, -13], target: [1.2, 6.4, -6] } },
    { topic: "kingdom", label: "The body and lost roof", anchor: [1.2, 8.5, 0], view: { position: [-19, 13, 9], target: [1.2, 8.3, 0] } },
    { topic: "relics", label: "Lotus pedestal", anchor: [-13, 0.6, 0], view: { position: [-19, 2.6, 6], target: [-13, 0.5, 0] } },
  ],
  horizon: [
    { name: "Semeru", lat: -8.1089, lon: 112.923, relativeHeight: 3063, kind: "volcano" },
    { name: "Bromo", lat: -7.9421, lon: 112.953, relativeHeight: 1716, kind: "volcano" },
    { name: "Arjuno", lat: -7.7644, lon: 112.5894, relativeHeight: 2726, kind: "volcano" },
    { name: "Welirang", lat: -7.7326, lon: 112.5747, relativeHeight: 2543, kind: "volcano" },
    { name: "Kawi", lat: -7.9229, lon: 112.4522, relativeHeight: 2038, kind: "volcano" },
    { name: "Kelud", lat: -7.93, lon: 112.308, relativeHeight: 1118, kind: "volcano" },
  ],
  sources: [
    { title: "Jago Temple — Wikipedia", url: "https://en.wikipedia.org/wiki/Jago_Temple" },
    { title: "Candi Jago — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Jago" },
    {
      title: "Sejarah Candi Jago: Corak Agama, Peninggalan Kerajaan, & Relief — Tirto.id",
      url: "https://tirto.id/sejarah-candi-jago-corak-agama-peninggalan-kerajaan-relief-gCdw",
    },
    { title: "Candi Kidal — Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Candi_Kidal" },
  ],
  orbit: { position: [-27, 26, 25], target: [0, 6, 0] },
  realms: {
    lower: "Kamadhatu · relief terraces",
    middle: "Rupadhatu · body",
    upper: "Arupadhatu · lost roof",
  },
  setting: { plazaRadius: 55, shadowExtent: 35, approach: { x: -1, z: 0, start: 30 } },
  build: (textures: StoneTextures) => buildJago(textures),
};
