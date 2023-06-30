import { Request, Response, NextFunction } from 'express';

const validateCredentials =
   (schema: any) =>
   (req: Request, res: Response, next: NextFunction): any => {
      const validated = schema.validate(req.body, {
         abortEarly: false,
         errors: {
            wrap: {
               label: '',
            },
         },
         convert: true,
      });

      if (validated.error) {
         next(validated.error);
      } else {
         next();
      }
   };

export default validateCredentials;
