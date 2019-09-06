interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: "delay"
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    }
  }
}

type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>
type asyncMethodConnect<T, U> = (input: T) => Action<U>
type syncMethod<T, U> = (action: Action<T>) => Action<U>
type syncMethodConnect<T, U> = (action: T) => Action<U>

type methodsPick<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]

type EffectModuleMethods = methodsPick<EffectModule>
type EffectModuleMethodsConnect<T> = T extends asyncMethod<infer U, infer V>
  ? asyncMethodConnect<U, V>
  : T extends syncMethod<infer U, infer V>
  ? syncMethodConnect<U, V>
  : never

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type Connect = (module: EffectModule) => {
  [M in EffectModuleMethods]: EffectModuleMethodsConnect<EffectModule[M]>
}

const connect: Connect = m => ({
  delay: (input: number) => ({
    type: "delay",
    payload: `hello 2`
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds()
  })
});

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());

type T = {
  a: 1,
  b: never,
  c: string,
}
