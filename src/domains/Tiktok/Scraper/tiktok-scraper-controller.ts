import { Request, Response } from 'express';
import tiktokScraperServices from './tiktok-scraper-services';
import axios from 'axios';
import db from '../../../models';
import delay from '../../../utils/delay';

class TiktokScraperController {
   public scrape = async (req: Request, res: Response): Promise<Response> => {
      // let cursor: number = 0;

      // let result = await tiktokScraperServices.getUserFeed();
      // console.info(result.data);
      // console.info(`HAS MORE : ${result.data.hasMore}`);
      // console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      // console.info('==========================');
      // let i: number = 0;
      // result.data.itemList.forEach((result: any) => {
      //    console.info(
      //       `${i + 1} : ${new Date(result.createTime * 1000)} | ${result.id}`,
      //    );
      //    i++;
      // });

      // result = await tiktokScraperServices.getUserFeed2(1685264595000);
      // console.info(result.data);
      // console.info(`HAS MORE : ${result.data.hasMore}`);
      // console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      // console.info('==========================');
      // let j: number = 0;
      // result.data.itemList.forEach((result: any) => {
      //    console.info(
      //       `${j + 1} : ${new Date(result.createTime * 1000)} | ${result.id}`,
      //    );
      //    i++;
      // });

      // while (result.data.hasMore.toString() == 'true') {
      //    cursor += 10000;
      //    result = await tiktokScraperServices.getUserFeed2(cursor);

      //    console.info(`HAS MORE : ${result.data.hasMore}`);
      //    console.info(`ITEM LENGTH : ${result.data.itemList.length}`);
      //    console.info('==========================');
      //    let i: number = 0;
      //    result.data.itemList.forEach((result: any) => {
      //       console.info(
      //          `${i + 1} : ${new Date(result.createTime * 1000)} | ${
      //             result.id
      //          }`,
      //       );
      //       i++;
      //    });
      // }

      // const { 'x-tt-params': xTtParams } = payloads.signature;
      // const { user_agent: userAgent } = payloads.navigator;

      // const results = await axios({
      //    method: 'GET',
      //    headers: {
      //       'user-agent': userAgent,
      //       'x-tt-params': xTtParams,
      //    },
      //    url: TT_REQ_PERM_URL,
      // });

      // console.info(results);

      const dummyUsernameArr: Array<string> = [
         'bapendajabar',
         'dkppjabar',
         'diskominfocianjur',
      ];

      await tiktokScraperServices.init();

      // const cookies = await tiktokScraperServices.login();
      // console.info(cookies);

      for (let j: number = 0; j < dummyUsernameArr.length; j++) {
         console.info(`Scraping akun : ${dummyUsernameArr[j]!.toUpperCase()}`);
         await tiktokScraperServices.goToUserPage(dummyUsernameArr[j]!);

         const followerAmount: string =
            await tiktokScraperServices.getFollowerAmount();

         const feeds = await tiktokScraperServices.getUserFeed();

         for (let i: number = 0; i < feeds.length; i++) {
            await tiktokScraperServices.goToFeedPage(feeds[i] || '');

            const feedCommentAmount: number =
               await tiktokScraperServices.getFeedCommentAmount();
            const feedLikeAmount: number =
               await tiktokScraperServices.getFeedLikeAmount();

            await db.tbl_scraping.create({
               tiktok_username: dummyUsernameArr[i],
               url: feeds[i],
               follower_count: followerAmount,
               like_count: feedLikeAmount,
               comment_count: feedCommentAmount,
            });
         }
      }

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'Scrape Data Successfuly!',
         },
      });
   };

   public injectNetwork = async (
      req: Request,
      res: Response,
   ): Promise<Response> => {
      await tiktokScraperServices.init();
      // await tiktokScraperServices.login();

      const dummyTargetSecUid: Array<any> = [
         {
            username: 'dinkesjabarofficial',
            sec_uid:
               'MS4wLjABAAAAmj0tYz7qmnVgdB93at1TIG43IDOORo2a2OH7FqkRE-SjFL291KJ1MG0lJ4w5WRxJ',
         },
         {
            username: 'diskominfo.jabar',
            sec_uid:
               'MS4wLjABAAAAodXalxStCpyOs0_0w0JZ0yYSuvWPO-oVCqgOW9rxkXFZIXzL5yfQUfzdXUHgJrcA',
         },
      ];

      /**
       * TEST GET RESPONSESIVNESS
       */
      const comments = await tiktokScraperServices.getResponseFeedAmount(
         'dinkesjabarofficial',
      );

      // console.info(comments);

      /**
       * THIS TEST INJECT WITH LOGIN
       * sementara hasil nya gagal
       */
      // await tiktokScraperServices.goToUserPage(dummyTargetSecUid[0].username!);
      // const followerAmount = await tiktokScraperServices.getFollowerAmount();
      // console.info(followerAmount);

      // let result = await tiktokScraperServices.injectUserFeed(
      //    dummyTargetSecUid[0].sec_uid!,
      // );
      // console.info(result);

      // const response = await tiktokScraperServices.getResponseFeedAmount(
      //    dummyTargetSecUid[0].username!,
      // );

      // console.info(response);

      // await tiktokScraperServices.goToUserPage(dummyTargetSecUid[0].username!);
      // const followerAmount = await tiktokScraperServices.getFollowerAmount();

      /**
       * THIS WORK
       * kendalanya kadang response tidak ada
       */
      // for (let i: number = 0; i < dummyTargetSecUid.length; i++) {
      //    let result = await tiktokScraperServices.injectUserFeed(
      //       dummyTargetSecUid[i].sec_uid!,
      //    );
      //    console.info(result);

      //    await tiktokScraperServices.goToUserPage(
      //       dummyTargetSecUid[i].username!,
      //    );
      //    const followerAmount = await tiktokScraperServices.getFollowerAmount();

      //    let feeds = result.data.itemList;

      //    for (let j: number = 0; j < feeds.length; j++) {
      //       console.info(`Username : ${feeds[j].author.uniqueId}`);
      //       console.info(
      //          `Url : https://www.tiktok.com/@${feeds[j].author.uniqueId}/${feeds[j].id}`,
      //       );
      //       console.info(`Follower : ${followerAmount}`);
      //       console.info(`Like : ${feeds[j].stats.diggCount}`);
      //       console.info(`Comment : ${feeds[j].stats.commentCount}`);
      //       console.info(`Response : IN DEV`);
      //       console.info(feeds[i]);
      //    }
      // }

      return res.status(200).json({
         code: 200,
         status: 'OK',
         data: {
            message: 'Scrape Data Successfuly!',
         },
      });
   };
}

export default new TiktokScraperController();
