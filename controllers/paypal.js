import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com",
};

export async function createOrder(req, res) {
  try {
    const accessToken = await generatePaypalAccessToken();
    const url = `${baseURL.sandbox}/v2/checkout/orders`;
    console.log(req.body.cost);
    const response = await axios.post(
      url,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: req.body.cost,
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);
    res.send(response.data);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// use the orders api to capture payment for an order
export async function capturePayment(req, res) {
  // await capturePaymentSchema.validateAsync(req.body)
  const { orderID } = req.body;
  const accessToken = await generatePaypalAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderID}/capture`;
  const response = await axios.post(url, null, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = response.data;
  const amount = data.purchase_units[0].payments.captures[0].amount.value;
  console.log(data);
  res.send(data);
}

export const checkPaypalTransaction = async (payoutID) => {
  try {
    const accessToken = await generatePaypalAccessToken();
    const payoutStatus = await axios.get(
      `${baseURL.sandbox}/v1/payments/payouts/${payoutID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return payoutStatus.data.batch_header.batch_status;
  } catch (err) {
    console.error(err);
  }
};
export async function pollTransactionStatus(payoutID) {
  // await pollTransactionStatusSchema.validateAsync({ payoutID })
  let status = "";
  while (status !== "SUCCESS") {
    status = await checkPaypalTransaction(payoutID);
    if (status === "SUCCESS") {
      return status;
    } else if (status === "PROCESSING") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } else {
      return status;
    }
  }
}

// generate an access token using client id and app secret
export async function generatePaypalAccessToken() {
  try {
    const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
    const url = `${baseURL.sandbox}/v1/oauth2/token`;
    const response = await axios.post(url, "grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (err) {
    console.log({ message: err.message });
  }
}
