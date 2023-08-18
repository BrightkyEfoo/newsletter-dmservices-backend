import wwebjs, { MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import { clients, contacts } from '../../../app';
const timeToWaitForType = 5000;

export const broadCastMessage = async (n: number, messgeText: string) => {
  console.log('inside the box');
  let subClients = [];
  let tempClients = clients.filter(client => client.isRunning === false);
  console.log('tempClients[0]', tempClients[0].isRunning);
  if (tempClients.length === 0) {
    tempClients = clients;
  }
  if (n < 10) {
    subClients = tempClients.slice(0, 1);
    clients[0].isRunning == false;
  } else {
    if (tempClients.length < 3) {
      subClients = tempClients.slice(0, 2);
    } else {
      subClients = tempClients.slice(0, 2);
    }
  }
  // console.log('subClients', subClients.length);
  console.log('subClients', subClients.length);
  for (let i = 0; i < n; i++) {
    let timeOutMessage = new Date().toLocaleTimeString
    console.log('i', i);
    let client = subClients[i % subClients.length];
    console.log('client choosed');
    await putTypeOnScreen(client.client, contacts[i], timeToWaitForType);
    client.client.sendMessage(contacts[i], messgeText + '\n\n' + timeOutMessage);
  }
  subClients.forEach(client => {
    client.isRunning = false;
  });
};

export const broadCastMessageMedia = async (
  n: number,
  messgeText: string,
  media: MessageMedia
) => {
  console.log('inside the box');
  let subClients = [];
  let tempClients = clients.filter(client => client.isRunning === false);
  console.log('tempClients[0]', tempClients[0].isRunning);
  if (tempClients.length === 0) {
    tempClients = clients;
  }
  if (n < 10) {
    subClients = tempClients.slice(0, 1);
  } else {
    subClients = tempClients.slice(0, 2);
  }
  // clients.forEach(client => {
  //   client.isRunning = true;
  // });
  console.log('subClients', subClients.length);
  for (let i = 0; i < n; i++) {
    let timeOutMessage = new Date().toLocaleTimeString
    console.log('i', i);
    if(subClients.length === 2){
      if(subClients[0].isRunning === true){
        let client = subClients[i % subClients.length];
        console.log('client choosed');
        console.log(client.isRunning);
        await putTypeOnScreen(client.client, contacts[i], timeToWaitForType);
        client.client.sendMessage(contacts[i], media, { caption: messgeText + '\n\n' + timeOutMessage });
      }else{
        let client = subClients[1];
        console.log('client choosed');
        console.log(client.isRunning);
        await putTypeOnScreen(client.client, contacts[i], timeToWaitForType);
        client.client.sendMessage(contacts[i], media, { caption: messgeText });
      }
    }else{
      let client = subClients[i % subClients.length];
      console.log('client choosed');
      console.log(client.isRunning);
      await putTypeOnScreen(client.client, contacts[i], timeToWaitForType);
      client.client.sendMessage(contacts[i], media, { caption: messgeText });
    }
  }
  clients.forEach(client => {
    client.isRunning = true;
    console.log('true');
  });
};

function sendStateTyping(client: wwebjs.Client, contact: string) {
  return client.pupPage?.evaluate(chatId => {
    // @ts-ignore
    window.WWebJS.sendChatstate('typing', chatId);
    return true;
  }, contact);
}
/**
 * Stops typing or recording in chat immediately.
 */
function clearState(client: wwebjs.Client, contact: string) {
  return client.pupPage?.evaluate(chatId => {
    // @ts-ignore
    window.WWebJS.sendChatstate('stop', chatId);
    return true;
  }, contact);
}

const putTypeOnScreen = (client: wwebjs.Client, contact: string, t: number) => {
  return new Promise<void>(async (resolve, reject) => {
    sendStateTyping(client, contact);
    await delay(t);
    clearState(client, contact);
    resolve();
  });
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
