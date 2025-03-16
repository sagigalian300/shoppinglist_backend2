const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyAcOZ8__Kgw2l2se5h4EmgHgwIJUDqQ884");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


async function calculateCartPrice(cart){
  const prompt = `
Given an array of objects representing items in a shopping cart, add a "price" field to each object.

actual array: ${JSON.stringify(cart)}

for example:
Input:
[
  { "name": "banana", "section": "fruits", "amount": 2 },
  { "name": "apple", "section": "vegetables", "amount": 1 }
]

Output:
[
  { "name": "banana", "section": "fruits", "amount": 2, "price": [price of 1 banana] },
  { "name": "apple", "section": "vegetables", "amount": 1, "price": [price of 1 apple] }
]

Instructions:

1.  The input will always be a valid JSON array of objects.
2.  Each object in the array will have "name", "section", and "amount" fields.
3.  Add a "price" field to each object.
4.  The "price" field should represent the price of one *individual* item.
5.  Return the modified array in valid JSON format.
6.  Do not include any additional text or explanations in the response. Only return the modified JSON array.
7. price can be decimal.
8. calculate the prices.
9. give the prices from the rami levy website only! here is the link: 'https://www.rami-levy.co.il/he'
10. When the product is usually misured by weight, find the average weight of the proudct, then find the 
price for one unit of the product, for example if apple per kg is x shekels, and 1 apple weight is 80g
then 0.08x
`;
  const result = await model.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;
  console.log(text);
  return text;
}

async function getProducts(numberOfProducts, desc) {
  // const prompt = "החזר מערך המכיל" + numberOfProducts + " שמות של מוצרי מזון חיוניים שנמצאים בדרך כלל בכל בית. התמקד במוצרים שימושיים ויומיומיים שרוב האנשים רוכשים, כמו לחם, חלב, ביצים, אורז וירקות. אל תכלול מוצרים לא רגילים או מיוחדים. הערך האחרון במערך צריך להיות המחיר המשוער של כל המוצרים בעגלת קניות ממוצעת בישראל בשקלים, בהתבסס על מחירים ממוצעים של רשתות סופרמרקטים גדולות כמו שופרסל, רמי לוי או יש פארם. חשוב להימנע ממחירים לא הגיוניים. אל תכלול שום טקסט חוץ מהמערך עצמו.";

  const prompt = `החזר לי מערך בגודל ${numberOfProducts} של אובייקטים שונים כאשר כל אובייקט מציין מאכל שכדאי שיהיה בכל בית. לכל אובייקט יש את השדות הבאים:
    - name (מחרוזת): שם המוצר.
    - section (מחרוזת): סוג המוצר, אחד מהבאים: ירקות, פירות, בשרים, מוצרי חלב, יבשים, מוצרי ניקיון.
    אל תוסיף שום מלל מלבד המערך
    דוגמה לפלט:
    [
      {
        "name": "עגבניות",
        "section": "ירקות",
      },
      {
        "name": "חלב",
        "section": "מוצרי חלב",
      },
      ...
    ]
      התחשב בהערות הבאות:
      ${desc}
    `;

  const result = await model.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;
  return text;
}

module.exports = {
  getProducts,
  calculateCartPrice,
};

/*
    google ai (gemini)
    AIzaSyAcOZ8__Kgw2l2se5h4EmgHgwIJUDqQ884
*/
