import { Request, Response } from 'express';
import IController from '../../interfaces/controller-interface';
// import { user, trend } from 'tiktok-scraper';

class TestController {
   async index(req: Request, res: Response): Promise<Response> {
      // const posts = await trend('', {
      //    number: 3,
      //    sessionList: ['sid_tt=9987d3813fe03e8e29ef7a7fec87fdb3;'],
      // });
      // console.log(posts);

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'THIS TEST',
         },
      });
   }
}

export default new TestController();
