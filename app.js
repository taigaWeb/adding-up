'use strict'
const fs = require('fs'); // fs モジュールを取り込み
const readline = require('readline'); // readline モジュールを取り込み
const rs = fs.createReadStream('./popu-pref.csv'); // csv からストリームを生成
const rl = readline.createInterface(
	{
	'input': rs, // 読み込みストリーム
	'output': {} // 書き込みストリーム（空オブジェクト）
	}
);
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => { // 1行を読み込んだ時の処理
	const columns = lineString.split(','); // カンマで１行を分割
	const year = parseInt(columns[0]); // columns の最初の要素を year に代入
	const prefecture = columns[1];
	const popu = parseInt(columns[3]);

	if (year === 2010 || year === 2015) {
		let value = prefectureDataMap.get(prefecture); // prefectureDataMap の添字が prefecture である値を取得して value というオブジェクトに代入
		if (!value) { // もし value（都道府県のデータのオブジェクト） が falthy だったら
			value = {
				popu10: 0,
				popu15: 0,
				change: null
			};
		}
		if (year === 2010) {
			value.popu10 = popu;
		}
		if (year === 2015) {
			value.popu15 = popu;
		}
		prefectureDataMap.set(prefecture, value);}
}); // line イベントが起きた時に上記を処理

rl.on('close', () => {
	for (let [key, value] of prefectureDataMap){
		value.change = value.popu15 / value.popu10;
}
	const rankingArray = Array.from(prefectureDataMap).sort(
		(pair1, pair2) => {return pair2[1].change - pair1[1].change}); // 連想配列を普通の配列に変える
	const rankingStrings = rankingArray.map(([key, value]) => {return key + ':' + value.popu10 + '->' + value.popu15 + ' 変化率:' + value.change;});
	console.log(rankingStrings);
})
