const colors = [
  "7048a3",
  "ffbf84",
  "958e80",
  "f6f2ab",
  "ff6955",
  "acdcff",
  "75b970",
  "f3e7cf",
];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export default getRandomColor;
