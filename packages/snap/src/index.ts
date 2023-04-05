import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

async function getFees() {
  const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
  return response.text();
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      const fees = await getFees();
      const feesObject = JSON.parse(fees);
      const safeLow = Math.ceil(parseFloat(feesObject.safeLow));
      const standard = Math.ceil(parseFloat(feesObject.average));
      const fastest = Math.ceil(parseFloat(feesObject.fastest));
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'Confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text(`Low: ${safeLow}\n`),
            text(`Average: ${standard}\n`),
            text(`High: ${fastest}\n`),
          ]),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
