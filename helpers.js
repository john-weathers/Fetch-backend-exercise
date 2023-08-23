// helper function to validate receipt contents and formatting
const validReceipt = (retailer, date, time, items, total) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^\d{2}:\d{2}/
  const priceRegex = /^\d+\.\d{2}$/;
  const descriptionRegex = /^[\w\s-]+$/

  // ensure all required properties exist
  if (!retailer || !date || !time || !items || !total) return false;

  // ensure format is correct on all
  if (!dateRegex.test(date) || !timeRegex.test(time) || !priceRegex.test(total)) return false;

  // make sure there is at least 1 item
  if (items.length < 1) return false;

  const result = items.map(item => {
    const { shortDescription, price } = item;
    if (!shortDescription || !price) return false;
    if (!descriptionRegex.test(shortDescription) || !priceRegex.test(price)) return false;
    return true;
  });

  // after mapping through items array, test to see if any item has properties missing or incorrect formatting (i.e. returned false above)
  if (result.some(bool => !bool)) return false;

  // break down date into year, month, day, make sure it's a legal date (that's not in the future)
  const currentYear = new Date().getFullYear();
  const dateArr = date.split('-');
  const year = Number(dateArr[0]);
  const month = Number(dateArr[1]);
  const day = Number(dateArr[2]);
  if (year > currentYear || month > 12 || day > 31) return false;
  if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) return false;
  if (month === 2 && day > 29) return false;

  // break down time, make sure it's a legal 24 hour time
  const timeArr = time.split(':');
  const hours = Number(timeArr[0]);
  const minutes = Number(timeArr[1]);
  const totalTime = Number(timeArr[0] + timeArr[1]);
  if (hours > 24 || minutes > 59 || totalTime > 2400) return false;

  // if all of the above tests are passed, the receipt is valid and true is returned
  return true;
}

// helper function to get total points awarded for a receipt
const getPoints = (retailer, date, time, items, total) => {
  const retailerRegex = /[A-Za-z0-9]/g

  let points = 0;

  // check for alphanumeric characters (match returns an array where each element is an individual match)
  points += retailer.match(retailerRegex).length;

  // grab day, check if it's an odd number
  const dateArr = date.split('-');
  const day = Number(dateArr[2]);
  if (day % 2 !== 0) {
    points += 6;
  }

  // get time in 24 hour (number) format, check if time is within given constraints
  const timeArr = time.split(':');
  const totalTime = Number(timeArr[0] + timeArr[1]);
  if (totalTime > 1400 && totalTime < 1600) {
    points += 10;
  }

  // divide number of items by 2, round down to nearest integer, give 5 points per pair
  points += Math.floor(items.length / 2) * 5;

  // check if trimmed description on each item in items array is a multiple of 3 and give appropriate points if so
  items.forEach(item => {
    const trimmedDescription = item.shortDescription.trim();
    if (trimmedDescription.length % 3 === 0) {
      points += Math.ceil(Number(item.price) * 0.2);
    }
  });

  // get total in cents as a number, then perform checks (first check to see if total is a round dollar amount, second for checking if total is a multiple of 0.25)
  const totalArr = total.split('.');
  const totalNum = Number(totalArr[0] + totalArr[1]);
  if (totalNum >= 100 && totalNum % 100 === 0) {
    points += 50;
  }

  if (totalNum > 0 && totalNum % 25 === 0) {
    points += 25;
  }

  return points;


}

module.exports = {
  validReceipt,
  getPoints,
}