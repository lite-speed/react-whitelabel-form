# React Whitelabel Form (alpha)

Let's you easily create strongly typed forms you can customize to your particular use case.

# Objectives

* inline validation
* performance
* less verbose
* don't use wrapper components (hard to read)
* build in state management specific to the form
* types all the way
* ability to handle any existing existing comp libraries
* makes it much easier to have uniformity with your forms (since it creates the "blessed" components)

## Install

```
yarn add react-whitelabel-form
OR
pnpm install react-whitelabel-form
OR
npm install react-whitelabel-form
```

## Example

```tsx
import {
  createUseWhitelabelForm,
  createWhitelabelComponent,
} from "react-whitelabel-form";

const useAcmeForm = createUseWhitelabelForm({
  TextInput: createWhitelabelComponent<string, { label: string }>((p) => {
    return (
      <div>
        <div>{p.customProps.label}</div>
        <div>
          <input
            type="text"
            value={p.requiredProps.value}
            onBlur={p.requiredProps.onBlur}
            onFocus={p.requiredProps.onFocus}
            onChange={(e) => p.requiredProps.onChangeValue(e.target.value)}
          />
        </div>
        {p.requiredProps.errors ? (
          <div>
            {p.requiredProps.errors.map((e, index) => {
              return <div key={index}>{e}</div>;
            })}
          </div>
        ) : null}
      </div>
    );
  }),
  NumberInput: createWhitelabelComponent<number, { label: string }>((p) => {
    return (
      <div>
        <div>{p.customProps.label}</div>
        <div>
          <input
            type="number"
            value={p.requiredProps.value}
            onBlur={p.requiredProps.onBlur}
            onFocus={p.requiredProps.onFocus}
            onChange={(e) =>
              p.requiredProps.onChangeValue(parseFloat(e.target.value))
            }
          />
        </div>
        {p.requiredProps.errors ? (
          <div>
            {p.requiredProps.errors.map((e, index) => {
              return <div key={index}>{e}</div>;
            })}
          </div>
        ) : null}
      </div>
    );
  }),
  SelectInput: createWhitelabelComponent<
    string,
    { label: string; options: { prettyVal: string; val: string }[] }
  >((p) => {
    return (
      <div>
        <div>{p.customProps.label}</div>
        <div>
          <select
            onChange={(e) => p.requiredProps.onChangeValue(e.target.value)}
            value={p.requiredProps.value}
            onBlur={p.requiredProps.onBlur}
            onFocus={p.requiredProps.onFocus}
          >
            {p.customProps.options.map((o) => {
              return (
                <option key={o.val} value={o.val}>
                  {o.prettyVal}
                </option>
              );
            })}
          </select>
        </div>
        {p.requiredProps.errors ? (
          <div>
            {p.requiredProps.errors.map((e, index) => {
              return <div key={index}>{e}</div>;
            })}
          </div>
        ) : null}
      </div>
    );
  }),
});

function App() {
  const { TextInput, NumberInput, SelectInput, store, useStoreValue } =
    useAcmeForm({
      initState: { email: "", name: "", age: 0, favFood: "" },
    });

  return (
    <div>
      <form
        onSubmit={(e) => {
          store.validate();
          console.log(store.get());
          e.preventDefault();
        }}
      >
        <TextInput
          label="Enter your name"
          validate={(v) => {
            return "";
          }}
          field={(s) => s.name}
          minLength={3}
          maxLength={[50, "Name is too long "]}
        />
        <TextInput
          label="Enter your email"
          field={(s) => s.email}
          pattern={["email", "Not a valid email"]}
          required={true}
        />
        <NumberInput
          label="Enter your age"
          min={0}
          max={120}
          field={(s) => s.age}
        />
        <SelectInput
          field={(s) => s.favFood}
          label={"Fav Food"}
          validate={(s) => {
            if (store.get().age < 10 && s === "sushi") {
              return "Sushi is much too tasty for small children.";
            }
            return "";
          }}
          options={[
            { prettyVal: "Pizza", val: "pizza" },
            { prettyVal: "Sushi", val: "sushi" },
          ]}
        />
        <input type={"submit"} />
      </form>
    </div>
  );
}

export default App;
```
