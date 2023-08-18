import { Response } from 'express';

import { myRequest } from '../../../types/jwt';
import {
  broadCastMessage,
  broadCastMessageMedia,
} from '../functions/broadCast';
import { MessageMedia } from 'whatsapp-web.js';
import { History } from '../../../database/Sequelize';

export const broadcastHelper = async (
  req: myRequest<
    {},
    {
      number?: number;
      textMessage?: string;
      userId?: number;
      name?: string;
      range?: [number, number];
      mediaUrl?: string;
    }
  >,
  res: Response
) => {
  const { number, textMessage, userId, mediaUrl } = req.body;
  if (
    userId === undefined ||
    number === undefined ||
    textMessage === undefined
  ) {
    return res.json({ msg: 'tous les champs sont requis' });
  }
  if (mediaUrl !== undefined) {
    const media = await MessageMedia.fromUrl(mediaUrl);
    broadCastMessageMedia(number, textMessage, media).then(() => {
      console.log('termine');
    });
    History.create({
      media: mediaUrl,
      peoples: number,
      // @ts-ignore
      UserId: userId,
    }).then(history => {
      console.log('history created');
    });
  } else {
    broadCastMessage(number, textMessage).then(() => {
      console.log('termine');
    });
    History.create({
      peoples: number,
      // @ts-ignore
      UserId: userId,
    }).then(history => {
      console.log('history created');
    });
  }
  return res.json({ msg: 'success , votre transaction est en cours' });
};
