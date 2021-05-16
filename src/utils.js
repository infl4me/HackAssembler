export const dec2bin = (dec, width = 16) => {
  const bin = parseInt(dec, 10).toString(2);
  const leadingZerosLength = width - bin.length;
  const leadingZeros = new Array(leadingZerosLength).fill('0').join('');

  return `${leadingZeros}${bin}`;
};
