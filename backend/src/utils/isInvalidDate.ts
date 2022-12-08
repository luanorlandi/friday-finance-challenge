const isInvalidDate = (date: Date) => {
  return Number.isNaN(date.getTime());
};

export default isInvalidDate;
