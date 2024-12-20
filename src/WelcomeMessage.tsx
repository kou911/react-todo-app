import React from "react";

// 引数の型を定義
// Propsという名前で定義することが一般的です。
type Props = {
  uncompletedCount: number;
};

// WelcomeMessage という関数コンポーネントの定義
// 関数コンポーネントはパスカルケースで名前を設定します。
const WelcomeMessage = (props: Props) => {
  //【重要!】JSX構文で描いた「JSX要素」を return で返す
  return (
    <div className="text-blue-700">
      現在の未完了タスク：
      {props.uncompletedCount}個
    </div>
  );
};

// 他のファイルで WelcomeMessage を import できるようにする
export default WelcomeMessage;
