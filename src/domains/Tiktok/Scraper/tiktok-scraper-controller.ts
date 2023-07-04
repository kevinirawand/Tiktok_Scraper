import { Request, Response } from 'express';
import tiktokScraperServices from './tiktok-scraper-services';
import axios from 'axios';
import db from '../../../models';
import moment, { Moment } from 'moment';
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
         {
            username: 'disparbudjabar',
            sec_uid:
               'MS4wLjABAAAAHrNWJDGLAte4_JpfPin7q6VUDPeCvKuhtHwAp1OyTfDK6UPLLPYvQLVMwL9rkPFg',
         },
         {
            username: 'dukcapiljabar',
            sec_uid:
               'MS4wLjABAAAAtO0P7IhEzYR4U9m80lGU8zqdX5L4FilPguttjLNQeqdr76h5cIg8At-mcxbJUHvA',
         },
         {
            username: 'disperkim_jabar',
            sec_uid:
               'MS4wLjABAAAAhrOF35R5rvhcaA_lPdPSTr9KaxLTtP-BmQp3Yn_26sKETiPYBF1uzURA0TqfQgpN',
         },
         {
            username: 'disdik_jabar',
            sec_uid:
               'MS4wLjABAAAASxcsUGBmkaP8wywiNDIkWtJ30xDUMT00o0knk1crceuZmyCQBa3EdOw04KtdiS5u',
         },
         {
            username: 'dkppjabar',
            sec_uid:
               'MS4wLjABAAAA2Hl3pD4pRDHEdbnzbJIOp0wgG-2UeISQn_czr04GvMk7YbjGZ-8BR-DxfoeGH8an',
         },
         {
            username: 'jabarekspres',
            sec_uid:
               'MS4wLjABAAAAu9i6H1yy2SZEYYBHdfXg7l5wGmDWiD-4eQyrOGFrX0oxEZjfezFrTyS8WzjbRHAW',
         },
         {
            username: 'bpbdjabar',
            sec_uid:
               'MS4wLjABAAAAwnmko7UC0ZzETUQXmCB5vUYON2YGr5TWi5URouQxV8hR76RzxR5miMfYk1VOXyac',
         },
         {
            username: 'dinaspmptspjabar',
            sec_uid:
               'MS4wLjABAAAAgqu0sefOhU9E5N-PJBL2hjtRUAFy0r9GsAq8wnhg0lIyLAeGxSAL4HMC7-jP18Su',
         },
         {
            username: 'dinsos.jabar',
            sec_uid:
               'MS4wLjABAAAAbtxWxZ18S_z8EATlK15MqmIiVkxVyt87Yp4XHeogI0G9_YuubKYya3gB0Pk7xGuL',
         },
      ];

      /**
       * TESTING RESPONSIVENESS
       */
      // const responsiveness: number =
      //    await tiktokScraperServices.getResponsiveness(
      //       `https://www.tiktok.com/@dinkesjabarofficial/video/7236534223367064838`,
      //    );
      // console.info(`Response : ${responsiveness}`);

      for (let i: number = 0; i < dummyTargetSecUid.length; i++) {
         let result = await tiktokScraperServices.injectUserFeed(
            dummyTargetSecUid[i].sec_uid!,
            dummyTargetSecUid[i].username!,
         );

         while (result.data.itemList.length < 1 || !result.data.itemList) {
            result = await tiktokScraperServices.injectUserFeed(
               dummyTargetSecUid[i].sec_uid!,
               dummyTargetSecUid[i].username!,
            );
         }
         for (let j: number = 0; j < result.data.itemList.length; j++) {
            const feedCreateTime: Moment = moment(
               result.data.itemList[j].createTime * 1000,
            );

            /**
             * TESTER DATE YESTERDAY
             */
            // const feedCreateTime = moment('2023-07-03' + ' ' + '18:00');

            let dateCriteria: Moment = moment();
            dateCriteria.subtract(1, 'days');

            if (
               feedCreateTime.year() == dateCriteria.year() &&
               feedCreateTime.month() == dateCriteria.month() &&
               feedCreateTime.date() == dateCriteria.date()
            ) {
               console.info(`THIS POST YESTERDAY : ${feedCreateTime}`);

               await tiktokScraperServices.goToUserPage(
                  dummyTargetSecUid[i].username!,
               );
               const followerAmount =
                  await tiktokScraperServices.getFollowerAmount();

               let feeds = result.data.itemList;

               await db.tbl_scraping.create({
                  tiktok_username: feeds[j].author.uniqueId,
                  url: `https://www.tiktok.com/@${feeds[j].author.uniqueId}/video/${feeds[j].id}`,
                  follower_count: followerAmount,
                  view_count: feeds[j].stats.playCount,
                  comment_count: feeds[j].stats.commentCount,
                  response_count: 0,
               });

               console.info(`Username : ${feeds[j].author.uniqueId}`);
               console.info(
                  `Url : https://www.tiktok.com/@${feeds[j].author.uniqueId}/video/${feeds[j].id}`,
               );
               console.info(`Follower : ${followerAmount}`);
               console.info(`Views : ${feeds[j].stats.playCount}`);
               console.info(`Comment : ${feeds[j].stats.commentCount}`);

               // const responsiveness: number =
               //    await tiktokScraperServices.getResponsiveness(
               //       `https://www.tiktok.com/@${feeds[j].author.uniqueId}/video/${feeds[j].id}`,
               //    );
               // console.info(`Response : ${responsiveness}`);
               console.info(`Response : IN DEV`);
            } else {
               console.info('NOT POST YESTERDAY');
            }
         }
      }

      // console.info(result.data.itemList[0].contents[0].desc);

      /**
       * THIS WORK
       * kendalanya kadang response tidak ada
       */
      // for (let i: number = 0; i < dummyTargetSecUid.length; i++) {
      //    let result = await tiktokScraperServices.injectUserFeed(
      //       dummyTargetSecUid[i].sec_uid!,
      //       dummyTargetSecUid[i].username!,
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
