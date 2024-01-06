import { Request, Response } from 'express';
import axios from 'axios';
import { InternalError } from '../../errors/internal-error';

const createChargeCtrl = async (req: Request, res: Response) => {
    const {
        amount,
        redirect,
    } = req.body;
  const data = {
    amount: amount,
    currency: 'BHD',
    customer_initiated: true,
    threeDSecure: true,
    save_card: false,
    // description: 'Test Description',
    // metadata: { udf1: 'Metadata 1' },
    // reference: { transaction: 'txn_01', order: 'ord_01' },
    receipt: { email: true, sms: true },
    customer: {
      first_name: 'test',
      middle_name: 'test',
      last_name: 'test',
      email: 'a7med3365@gmail.com',
      phone: { country_code: 973, number: 35055557 },
    },
    // merchant: { id: '1234' },
    source: { id: 'src_all' },
    // post: { url: 'http://your_website.com/post_url' },
    redirect: { url: redirect },
  };

  const config = {
    headers: { Authorization: `Bearer ${process.env.TAP_SK}` },
  };

  axios
    .post('https://api.tap.company/v2/charges', data, config)
    .then((response) => {
        console.log(response.data);
        res.status(200).send({url: response.data.transaction.url});
    })
    .catch((error) => {
        console.error(error);
        throw new InternalError();
    });
};

const getChargeCtrl = async (req: Request, res: Response) => {
    const id = req.params.chargeId;
    const config = {
        headers: { Authorization: `Bearer ${process.env.TAP_SK}` },
    };
    axios
    .get(`https://api.tap.company/v2/charges/${id}`, config)
    .then((response) => {
        console.log(response.data);
        res.status(200).send(response.data);
    })
    .catch((error) => {
        console.error(error);
        throw new InternalError();
    });
}

export { createChargeCtrl, getChargeCtrl };