import { Request, Response } from 'express';
import axios from 'axios';
import { InternalError } from '../../errors/internal-error';
import { Fund } from '../../models/fund';
import { User } from '../../models/user';
import { BadRequestError } from '../../errors/bad-request-error';
import { Project } from '../../models/project';

const createChargeCtrl = async (req: Request, res: Response) => {
  const { amount, redirect, project, user } = req.body;
  const investor = await User.findById(user);
  if (!investor) {
    throw new BadRequestError('User not found');
  }
  const fundedProject = await Project.findById(project);
  if (!fundedProject) {
    throw new BadRequestError('Project not found');
  }
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
  try {
    const response = await axios.post(
      'https://api.tap.company/v2/charges',
      data,
      config
    );
    console.log(response.data);

    const fund = Fund.build({
      amount,
      project,
      user,
      chargeId: response.data.id,
      status: response.data.status,
    });
    await fund.save();

    res.status(200).send({ url: response.data.transaction.url });
  } catch (error) {
    console.error(error);
    throw new InternalError();
  }
};

const getChargeCtrl = async (req: Request, res: Response) => {
  const id = req.params.chargeId;
  const config = {
    headers: { Authorization: `Bearer ${process.env.TAP_SK}` },
  };
  try {
    const response = await axios.get(
      `https://api.tap.company/v2/charges/${id}`,
      config
    );

    const fund = await Fund.findOneAndUpdate(
      { chargeId: id },
      { status: response.data.status },
      { new: true }
    );

    console.log(response.data);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    throw new InternalError();
  }
};

const getFundsCtrl = async (req: Request, res: Response) => {
  let query = {};
  try {
    if (req.query.projectId) {
      query = { projectId: req.query.projectId };
    }
    if (req.query.userId) {
      query = { userId: req.query.userId };
    }

    const funds = await Fund.find(query);
    res.status(200).send(funds);
  } catch (error) {
    console.log(error);
    throw new InternalError();
  }
};

export { createChargeCtrl, getChargeCtrl, getFundsCtrl };
