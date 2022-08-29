import { Simplify, Merge } from "type-fest";
import { FormStore } from "./Store.js";

type MergeAndSimplify<T, U> = Simplify<Merge<T, U>>;

export type ValidateMode = "onChange" | "onBlur" | "onValidate" | "onTouched" | "all";
export type ReValidateMode = "onChange" | "onBlur" | "onValidate";

export type CreateUseWhitelabelFormReturnValue<Components extends ComponentsMap, State extends object> = {
  [K in keyof Components]: Components[K] extends WhiteLabelComponentWrapper<any, any>
    ? WhitelabelComponent<Components[K]["__CustomProps"], State, Components[K]["__Value"]>
    : never;
} & {
  store: Simplify<Omit<FormStore<State>, "useStoreValue">>;
  useStoreValue: FormStore<State>["useStoreValue"];
};

export type UseFormOpts<State extends object> = {
  initState: State;
  mode?: ValidateMode;
  reValidateMode?: ReValidateMode;
};

export type ComponentsMap = Record<string, WhiteLabelComponentWrapper<any, any>>;

export type AuthorFacingWhitelabelComponent<CustomProps extends object, Value> = (a: {
  customProps: Simplify<
    Omit<
      CustomProps,
      keyof (RequiredAuthorFormProps<Value> &
        BaseUnmergedWhitelabelComponentProps<any, any> &
        StringWhiteLabelComponentProps &
        NumericWhiteLabelComponentProps<any>)
    >
  >;
  requiredProps: RequiredAuthorFormProps<Value>;
  internalReservedProps: InternalReservedProps<Value>;
}) => JSX.Element | null;

type BaseUnmergedWhitelabelComponentProps<State, Value> = {
  field: (s: State) => Value;
  defaultValue?: Value;
  mode?: ValidateMode;
  reValidateMode?: ReValidateMode;
  validate?: Validator<Value> | Validator<Value>[];
  required?: true | string;
};

export type BaseWhiteLabelComponentProps<CustomProps extends object, State extends object, Value> = MergeAndSimplify<
  CustomProps,
  BaseUnmergedWhitelabelComponentProps<State, Value>
>;

export type StringWhiteLabelComponentProps = {
  pattern?: PatternType | [PatternType, string];
  minLength?: number | [number, string];
  maxLength?: number | [number, string];
};

export type NumericWhiteLabelComponentProps<Value extends number | Date> = {
  max?: Value | [Value, string];
  min?: Value | [Value, string];
};

export type WhitelabelComponentProps<CustomProps extends object, State extends object, Value> = Value extends string
  ? MergeAndSimplify<BaseWhiteLabelComponentProps<CustomProps, State, Value>, StringWhiteLabelComponentProps>
  : Value extends number | Date
  ? MergeAndSimplify<BaseWhiteLabelComponentProps<CustomProps, State, Value>, NumericWhiteLabelComponentProps<Value>>
  : BaseWhiteLabelComponentProps<CustomProps, State, Value>;

export type WhitelabelComponent<CustomProps extends object, State extends object, Value> = (
  a: WhitelabelComponentProps<CustomProps, State, Value>,
) => JSX.Element | null;

export type WhiteLabelComponentWrapper<Value, CustomProps extends object> = {
  __CustomProps: CustomProps;
  __Value: Value;
};

export type PatternType = "url" | "email" | "minimallySecurePassword" | RegExp;

type RequiredAuthorFormProps<Value> = {
  errors: string[];
  onFocus: () => void;
  onBlur: () => void;
  value: Value | undefined;
  onChangeValue: (newVal: Value | undefined) => void;
};

type InternalReservedProps<Value> = Value extends string
  ? MergeAndSimplify<BaseUnmergedWhitelabelComponentProps<Record<string, any>, Value>, StringWhiteLabelComponentProps>
  : Value extends number | Date
  ? MergeAndSimplify<
      BaseUnmergedWhitelabelComponentProps<Record<string, any>, Value>,
      NumericWhiteLabelComponentProps<Value>
    >
  : BaseUnmergedWhitelabelComponentProps<Record<string, any>, Value>;

type Validator<Value> = (currVal: Value) => null | undefined | false | "" | string | string[];
