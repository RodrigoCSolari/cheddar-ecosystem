import { getConfig } from '@/configs/config';
import { Wallet } from '@near-wallet-selector/core';

let id = 0;

export async function view(
  contractId: string,
  method: string,
  args: Record<string, any> = {}
): Promise<any> {
  const argsBase64 = btoa(JSON.stringify(args));
  const params = {
    request_type: 'call_function',
    account_id: contractId,
    method_name: method,
    args_base64: argsBase64,
    finality: 'optimistic',
  };
  return callRpc('query', params);
}

async function callRpc(
  method: string,
  params: Record<string, any>
): Promise<any> {
  const config = getConfig();
  const payload = {
    method,
    params,
    id: ++id,
    jsonrpc: '2.0',
  };

  const rpcOptions = {
    body: JSON.stringify(payload),
    method: 'POST',
    headers: { 'Content-type': 'application/json; charset=utf-8' },
  };

  const response = await fetch(config.networkData.nodeUrl, rpcOptions);
  const json = await response.json();
  // handlePossibleError(json, rpcOptions)
  return JSON.parse(encodeUTF8(json.result.result));
}

export async function change(
  wallet: Wallet,
  contractId: string,
  method: string,
  args: Record<string, any> = {},
  deposit = '',
  gas = '300' + '0'.repeat(12)
) {
  return wallet.signAndSendTransaction({
    receiverId: contractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: method,
          args,
          deposit,
          gas,
        },
      },
    ],
  });
}

export function encodeUTF8(arr: Uint8Array): string {
  const s: string[] = [];
  for (let i = 0; i < arr.length; i++) s.push(String.fromCharCode(arr[i]));
  return decodeURIComponent(escape(s.join('')));
}

export function yton(
  yoctos: string | bigint,
  token_decimals: number = 24,
  decimals: number = 5
) {
  yoctos = yoctos.toString();
  if (!yoctos) return 0;
  if (yoctos.indexOf('.') !== -1)
    throw new Error("a yocto string can't have a decimal point: " + yoctos);
  let negative = false;
  if (yoctos.startsWith('-')) {
    negative = true;
    yoctos = yoctos.slice(1);
  }
  let padded = yoctos.padStart(token_decimals + 1, '0'); //at least 0.xxx
  const decimalPointPosition = -token_decimals + decimals;
  let nearsText =
    padded.slice(0, -token_decimals) +
    '.' +
    padded.slice(-token_decimals, decimalPointPosition); //add decimal point. Equivalent to near=yoctos/1e24 and truncate to {decimals} dec places
  return Number(nearsText) * (negative ? -1 : 1);
}

export function ntoy(n: number, token_decimals: number = 24) {
  let by1e6 = Math.round(n * 1e6).toString(); // near * 1e6 - round
  let yoctosText = by1e6 + '0'.repeat(token_decimals - 6); //  mul by 1e18 => yoctos = near * 1e(6+18)
  return BigInt(yoctosText);
}
