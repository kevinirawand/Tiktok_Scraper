import puppeteer from 'puppeteer-extra';
import Signer from 'tiktok-signature';
import axios from 'axios';
import { Url } from 'url';
import jsonfile from 'jsonfile';

import { executablePath } from 'puppeteer';
import db from '../../../models';
import 'dotenv/config';
import Tpayloads from '../../../interfaces/payloads-interface';
import logger from '../../../utils/logger';
import delay from '../../../utils/delay';
import accounts from '../../../configs/tiktok-bot-account';
import path from 'path';
import UserAgent from 'user-agents';
import fs from 'fs';

class TiktokScraperServices {
   private browser: any;
   private page: any;
   private cookiesPath: string = path.join(
      './src/sessions/' + accounts[0]!.username + '.json',
   );

   private TT_REQ_USER_AGENT: string =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.56';

   public init = async (): Promise<void> => {
      if (!this.browser) {
         this.browser = await puppeteer.launch({
            headless: false,
            ignoreDefaultArgs: ['--disable-extensions'],
            args: [
               '--use-gl=egl',
               '--no-sandbox',
               '--disable-setuid-sandbox',
               '--disable-gpu',
               '--disable-dev-shm-usage',
               '--no-first-run',
               '--no-sandbox',
               '--no-zygote',
               '--deterministic-fetch',
               '--disable-features=IsolateOrigins',
               '--disable-site-isolation-trials',
               '--proxy-server=http://64.225.8.115:9980',
            ],
            dumpio: true,
         });
      }
      if (!this.page) {
         this.page = await this.browser.newPage();
      }

      this.page.setDefaultNavigationTimeout(0);
   };

   public goToUserPage = async (username: string): Promise<void> => {
      // this.page = await this.page.close();
      // this.page = await this.browser.newPage();
      // await this.page.goto(`https://www.tiktok.com/@${username}`, {
      //    timeout: 0,
      // });
      // this.page = await this.page.close();
      // this.page = await this.browser.newPage();
      // console.info(`USERNAME : ${username}`);
      await this.page.goto(`https://www.tiktok.com/@${username}`, {
         timeout: 0,
      });
   };

   public getUserFeed = async (): Promise<string[]> => {
      // await this.page.waitForNavigation();
      setTimeout(async (): Promise<void> => {
         await this.page.reload({
            waitUntil: ['networkidle0', 'domcontentloaded'],
         });
      }, 1000 * 60 * 3);

      // await this.autoScroll();

      // setTimeout(() => {}, 120000);

      // await this.autoScroll();

      // setTimeout(() => {}, 120000);

      // await this.autoScroll();

      // setTimeout(() => {}, 120000);

      // await this.autoScroll();

      let results: string[] = [];

      const hrefArr = await this.page.evaluate(() =>
         Array.from(
            document.querySelectorAll("div [data-e2e='user-post-item-list'] a"),
            (a) => a.getAttribute('href'),
         ),
      );

      hrefArr.forEach(async (result: string) => {
         if (
            result != 'https://www.tiktok.com/' &&
            !result.includes('/tag') &&
            result.includes('https://www.tiktok.com/@')
         ) {
            results.push(result);
         }
      });

      console.info(results);
      return results;
   };

   public autoScroll = async (): Promise<void> => {
      await this.page.evaluate(async () => {
         await new Promise((resolve: any): void => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval((): void => {
               var scrollHeight = document.body.scrollHeight;
               window.scrollBy(0, distance);
               totalHeight += distance;

               if (totalHeight >= scrollHeight - window.innerHeight) {
                  clearInterval(timer);
                  resolve();
               }
            }, 100);
         });
      });
   };

   public getFollowerAmount = async (): Promise<string> => {
      const followerElement = await this.page.$(
         '#main-content-others_homepage > div > div.tiktok-1g04lal-DivShareLayoutHeader-StyledDivShareLayoutHeaderV2.enm41492 > h3 > div:nth-child(2) > strong',
      );

      const followerAmount = await (
         await followerElement.getProperty('textContent')
      ).jsonValue();
      return followerAmount;
   };

   public getFeedCommentAmount = async (): Promise<number> => {
      const commentElement = await this.page.$(
         '#main-content-video_detail > div > div.tiktok-12kupwv-DivContentContainer.ege8lhx2 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx3 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-14a6qal-DivVideoContainer.eqrezik6 > div.tiktok-79f36w-DivActionBarWrapper.eqrezik7 > div > button:nth-child(2) > strong',
      );

      const commentAmount = await (
         await commentElement.getProperty('textContent')
      ).jsonValue();

      return parseInt(commentAmount);
   };

   public getFeedLikeAmount = async (): Promise<number> => {
      const likeElement = await this.page.$(
         '#main-content-video_detail > div > div.tiktok-12kupwv-DivContentContainer.ege8lhx2 > div.tiktok-1senhbu-DivLeftContainer.ege8lhx3 > div.tiktok-1sb4dwc-DivPlayerContainer.eqrezik3 > div.tiktok-14a6qal-DivVideoContainer.eqrezik6 > div.tiktok-79f36w-DivActionBarWrapper.eqrezik7 > div > button:nth-child(1) > strong',
      );

      const likeAmount = await (
         await likeElement.getProperty('textContent')
      ).jsonValue();

      return parseInt(likeAmount);
   };

   public getResponseFeedAmount = async (username: string): Promise<number> => {
      const userAgent = new UserAgent();
      await this.page.setUserAgent(userAgent.random().toString());
      const context = await this.browser.createIncognitoBrowserContext();
      const page = await context.newPage();

      await page.goto(
         'https://www.tiktok.com/@dinkesjabarofficial/video/7236534223367064838',
         { waitUntil: 'load' },
      );

      await delay(5000);
      let isCaptchaShow: boolean = await page
         .$eval('#tiktok-verify-ele', () => true)
         .catch(() => false);

      isCaptchaShow
         ? logger.info('CAPTCHA IS SHOW...')
         : logger.info('CAPTCHA NOT SHOW!');

      const comments = new Promise((resolve, reject) => {
         page.on('response', async (response: any) => {
            if (
               response
                  .url()
                  .includes(`https://www.tiktok.com/api/comment/list/`)
            ) {
               await this.page.setRequestInterception(true);

               console.info('THIS INCLUDE COMMENT LIST');
               console.info(response.url());
               try {
                  const newRespon = await response.json();
                  console.info(newRespon);
                  resolve(newRespon);
               } catch (error) {
                  logger.error(error);
               }
            } else {
               logger.info('NO ONE INCLUDED COMMENT LIST');
            }
         });
      });

      // while (isCaptchaShow) {
      //    logger.info('CHAPTCHA IS SHOWED');
      //    await this.page.setUserAgent(userAgent.random().toString());

      //    await delay(3000);
      //    await this.page.reload();
      //    await delay(5000);

      //    isCaptchaShow = await this.page
      //       .$eval('#tiktok-verify-ele', () => true)
      //       .catch(() => false);
      // }

      console.info(comments);

      return 0;
   };

   public captchaSolver = async (username: string): Promise<void> => {
      /**
       * GET CAPTCHA IMAGE
       */
      await delay(3000);
      const IMAGE_SELECTOR = '#captcha-verify-image';
      let imageHref = await this.page.evaluate((element: any) => {
         return document
            .querySelector(element)
            .getAttribute('src')
            .replace('/', '');
      }, IMAGE_SELECTOR);

      const filePath: string =
         './src/captchas/' +
         username +
         new Date().getTime() +
         '-catpcha_image' +
         '.jpeg';
      const getImageTab = await this.browser.newPage();
      const viewSource = await getImageTab.goto(imageHref);
      fs.writeFile(filePath, await viewSource.buffer(), function (err) {
         if (err) {
            logger.error(err);
         }

         logger.info('Captcha image was saved!');
      });
      await getImageTab.close();
   };

   public goToFeedPage = async (feedUrl: string): Promise<void> => {
      await this.page.waitForTimeout(4000);
      await this.page.goto(feedUrl, {
         timeout: 0,
      });
      await this.page.waitForTimeout(4000);
   };

   public getSignature = async (secUid: string): Promise<any> => {
      // const SEC_UID: string =
      //    'MS4wLjABAAAAmj0tYz7qmnVgdB93at1TIG43IDOORo2a2OH7FqkRE-SjFL291KJ1MG0lJ4w5WRxJ';

      let PARAMS: any = {
         aid: '1988',
         count: 30,
         secUid: secUid,
         cursor: 0,
         cookie_enabled: true,
         screen_width: 0,
         screen_height: 0,
         browser_language: '',
         browser_platform: '',
         browser_name: '',
         browser_version: '',
         browser_online: '',
         timezone_name: 'Europe/London',
      };

      const signer = new Signer(null, this.TT_REQ_USER_AGENT);
      await signer.init();

      const qsObject = new URLSearchParams(PARAMS);
      const qs = qsObject.toString();

      const unsignedUrl = `https://m.tiktok.com/api/post/item_list/?${qs}`;
      const signature = await signer.sign(unsignedUrl);
      const navigator = await signer.navigator();
      await signer.close();

      const payloads: object = {
         xTtParams: signature['x-tt-params'],
         userAgent: navigator.user_agent,
      };

      return payloads;
   };

   public getUserInfo = async (): Promise<any> => {
      // this.page.on('response', async (response: any) => {
      //    if (
      //       response
      //          .url()
      //          .includes(`https://www.tiktok.com/api/user/detail/`)
      //    ) {
      //       const newRespon = await response.json();
      //       console.info('THIS RESPONSE');
      //       console.info(newRespon);
      //    } else {
      //       console.info('UPSSS!!');
      //    }
      // });
      // this.page.on('response', async (response: any) => {
      //    if (
      //       response.url().includes(`https://www.tiktok.com/api/user/detail/`)
      //    ) {
      //       console.info('THIS RESPONSE');
      //       const results: any = await response.json();
      //       console.info(results);
      //    } else {
      //       console.info('UPSS!!');
      //    }
      //    // console.log('response code: ', response.status());
      //    // do something here
      // });

      // await this.page.waitForNavigation();
      await delay(5000);
      await this.page.reload({
         waitUntil: ['load', 'domcontentloaded'],
      });
      // await this.page.waitForNavigation();

      // const usePromise = new Promise(async (resolve, reject) => {
      //    await this.page.on('response', async (response: any) => {
      //       if (
      //          response
      //             .url()
      //             .includes(`https://www.tiktok.com/api/user/detail/`)
      //       ) {
      //          const newRespon = await response.json();
      //          console.info(newRespon);
      //          resolve(newRespon);
      //       }
      //    });
      // });
      // usePromise.then((result) => {
      //    console.info(result);
      // });
      // console.info();
      // return usePromise;

      const finalResponse = await this.page.waitForResponse((response: any) =>
         response.url().includes(`https://www.tiktok.com/api/user/detail/`),
      );
      console.log(finalResponse);
      console.info('AFTER FINAL');
   };

   public injectUserFeed = async (secUid: string): Promise<any> => {
      // const usernameTesting: string = 'musiklirik_1';
      const payloads = await this.getSignature(secUid);
      console.info(payloads);
      const option = {
         method: 'GET',
         headers: {
            'user-agent': payloads.userAgent,
            'x-tt-params': payloads.xTtParams,
         },
         url: 'https://www.tiktok.com/api/post/item_list/?aid=1988&app_language=en&app_name=tiktok_web&battery_info=1&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F107.0.0.0%20Safari%2F537.36%20Edg%2F107.0.1418.56&channel=tiktok_web&cookie_enabled=true&device_id=7165118680723998214&device_platform=web_pc&focus_state=true&from_page=user&history_len=3&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=RO&referer=&region=RO&screen_height=1440&screen_width=2560&tz_name=Europe%2FBucharest&webcast_language=en&msToken=G3C-3f8JVeDj9OTvvxfaJ_NppXWzVflwP1dOclpUOmAv4WmejB8kFwndJufXBBrXbeWNqzJgL8iF5zn33da-ZlDihRoWRjh_TDSuAgqSGAu1-4u2YlvCATAM2jl2J1dwNPf0_fk9dx1gJxQ21S0=&X-Bogus=DFSzswVYxTUANS/JS8OTqsXyYJUo&_signature=_02B4Z6wo00001CoOkNwAAIDBCa--cQz5e0wqDpRAAGoE8f',
      };

      return axios(option);
   };

   public writeCookies = async (): Promise<void> => {
      const cookiesObject = await this.page.cookies();
      // console.info(cookiesObject);
      console.info(this.cookiesPath);

      jsonfile.writeFileSync(this.cookiesPath, cookiesObject, { spaces: 2 });

      const cookiesArr = jsonfile.readFileSync(this.cookiesPath);
      if (cookiesArr.length !== 0) {
         for (let cookie of cookiesArr) {
            await this.page.setCookie(cookie);
         }
         logger.info('Session has been loaded in the browser');
      }
   };

   public login = async (): Promise<any> => {
      await this.page.goto('https://www.tiktok.com/', {
         waitUntil: 'networkidle2',
      });

      await delay(3000);

      const button = await this.page.$('#header-login-button');
      await button.evaluate((button: any) => button.click());

      await delay(3000);

      const loginWithPhoneNumber = await this.page.$(
         '#loginContainer > div > div > a:nth-child(3)',
      );
      await loginWithPhoneNumber.evaluate((button: any) => button.click());
      await delay(3000);

      const loginWithPassword = await this.page.$(
         '#loginContainer > div.tiktok-xabtqf-DivLoginContainer.exd0a430 > form > a',
      );
      await loginWithPassword.evaluate((button: any) => button.click());
      await delay(3000);

      await this.page.type('input[name="mobile"]', accounts[0]!.phone_number, {
         delay: 100,
      });
      await delay(3000);

      await this.page.type(
         'input[type="password"]',
         accounts[0]!.phone_number,
         { delay: 100 },
      );
      await delay(3000);

      await this.page.click(
         '#loginContainer > div.tiktok-xabtqf-DivLoginContainer.exd0a430 > form > button',
      );
      await delay(5000);

      await this.writeCookies();
      await delay(600000);
      await this.page.waitForTimeout(600000000);
   };
}

export default new TiktokScraperServices();
