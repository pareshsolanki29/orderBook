import { any } from 'prop-types';
import React, { useState, useEffect } from 'react';


interface Asks {
    asks: string
}
interface Bids{
    bids: string
}
interface  ResOrder {
    bids: Array<Bids>,
    asks: Array<Asks>
}
const OrderBook = () => {
//   const [orders, setOrders] = React.useState <ResOrder | undefined >(undefined);
  const [orders, setOrders] = useState({ asks:[], bids:[]});

  const currencyPair = 'btcusd';

  const currencyArray = [currencyPair.toUpperCase().match(/.{1,3}/g) ];

  React.useEffect(() => {
    const subscribe = {
      event: 'bts:subscribe',
      data: {
        channel: `order_book_${currencyPair}`
      }
    };
    const ws = new WebSocket('wss://ws.bitstamp.net');

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setOrders(response.data);
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [currencyPair]);

  const { bids, asks } = orders;
  const orderRows = (arr: any[]) =>
    arr &&
    arr.map((item, index) => (
      <tr key={index}>
        <td> {item[1]} </td>
        <td> {item[0]} </td>
      </tr>
    ));
  const orderHead = (title:any) => (
    <thead>
      <tr>
        <th>{title}</th>
      </tr>
      <tr>
        <th>Amount ({currencyArray[0]})</th>
        <th>Price ({currencyArray[1]})</th>
      </tr>
    </thead>
  );
  return (
    <div className="order-container">
      <table>
        {orderHead('Bids')}
        <tbody>{orderRows(bids)}</tbody>
      </table>

      <table>
        {orderHead('Asks')}
        <tbody>{orderRows(asks)}</tbody>
      </table>
    </div>
  );
};

export default OrderBook;
