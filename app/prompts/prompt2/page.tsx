import PromptViewer from "../components/PromptViewer";

const prompt = `Transform the uploaded real-life photo into a high-quality cinematic Minecraft-inspired world
while preserving the exact original composition, framing, camera angle, crop, zoom level,
subject placement, pose, perspective, and overall scene layout.
FORMAT LOCK — NON-NEGOTIABLE
Preserve the original image aspect ratio.
Preserve the original image dimensions.
Do not change the framing, crop, zoom level, camera distance, subject scale, or subject
placement.
Do not generate a new composition.
The transformed image must match the original photo structure exactly.
SUBJECT LOCK — NON-NEGOTIABLE
Preserve the main human subject's pose, body proportions, facial direction, hairstyle silhouette,
clothing structure, body positioning, and perspective from the uploaded image.
The subject must remain clearly recognizable as the same person from the original photo.
Do not change the person's identity, outfit, pose, body shape, hairstyle, or placement.
STYLE DIRECTION
Convert the human subject into a cinematic Minecraft-inspired character.
Use Minecraft-style block geometry while keeping the original person recognizable.
Clothing should become voxel-textured while preserving the original outfit design, colors,
silhouette, and layering.
Face and body should feel like a high-end Minecraft RTX character, not a low-quality pixel filter.
Use realistic shader rendering, cinematic Minecraft lighting, and detailed voxel surface textures.
ENVIRONMENT TRANSFORMATION
Recreate the entire background as a Minecraft-inspired voxel world.
Terrain becomes cubic Minecraft blocks.
Trees become blocky voxel trees.
Grass, foliage, rocks, roads, paths, clouds, buildings, mountains, and landscapes become
Minecraft-style block structures.
Water becomes pixelated Minecraft water with realistic shader reflections if present.
Preserve the original environmental depth, horizon placement, perspective, and spatial layout.
OBJECT & PET RULE
Any non-human object or animal in direct physical contact with the subject must also be
converted into a Minecraft-style object or mob.
Dogs should become Minecraft-style wolves.
Nearby pets, bags, props, vehicles, benches, fences, or accessories should match the Minecraft
voxel environment while preserving their original placement and function.
LIGHTING & ATMOSPHERE
Use realistic Minecraft RTX lighting.
Add cinematic fog and atmospheric depth when suitable.
Use voxel shadows and block-based light behavior.
Lighting should match the direction and mood of the original photo while becoming Minecraft
shader-style.
If the original photo has haze, forest fog, sunset light, city glow, or mountain atmosphere,
recreate it with cinematic Minecraft-style volumetric effects.
CAMERA & REALISM
Maintain the exact camera angle and framing from the reference photo.
Keep the same lens feeling, subject distance, and perspective.
The result should feel like the original photograph was directly transformed into a realistic
Minecraft universe.
Avoid changing the scene layout or inventing a new background.
OUTPUT STYLE
High-quality cinematic Minecraft screenshot.
Ultra-detailed voxel world rendering.
Realistic Minecraft RTX gameplay aesthetic.
Block-textured terrain.
Authentic Minecraft visual identity.
Cinematic shader effects.
Stylized but believable game realism.
Immersive, atmospheric, and detailed.
The final image should feel like a real high-end Minecraft gameplay screenshot created from the
uploaded photo, while preserving the original image structure exactly.`;

export default function Prompt2Page() {
  return <PromptViewer content={prompt} />;
}
