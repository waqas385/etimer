
export async function playSound(sound) {
  const importSound = await import(/* @vite-ignore */'/@sounds/' + sound); 
  let audio = new Audio(importSound.default);
  audio.play().catch(e => alert(e));
}