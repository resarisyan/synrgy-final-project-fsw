const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const randomTokenGenerate = () => {
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

console.log(randomTokenGenerate());

export { randomTokenGenerate };
