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

## Example

```tsx
import {
  createUseWhitelabelForm,
  createWhitelabelComponent,
  createWhitelabelComponentWithOptions,
} from "react-whitelabel-form";

const useAcmeForm = createUseWhitelabelForm({
  TextInput: createWhitelabelComponent<{ label: string  }, string>((p) => {
    const { onChangeValue, errors, onBlur, onFocus, value } = p;
    return (
      <div>
        <input
          value={value}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={(e) => {
            onChangeValue(e.target.value);
          }}
        />
        {errors.length ? <div>{errors[0]}</div> : null}
      </div>
    );
  }),
});

function App() {
  const { TextInput, store, useStoreValue } = useAcmeForm({
    initState: { text1: "", text2: "Hello" }
  });

  return (
    <div>
      <form onSubmit={e => {
        console.log(store.get());
        e.preventDefault();
        store.validate()
      }}>
        <TextInput label="Cool Label 1" field={(s) => s.text1}     />
        <TextInput label="Cool Label 2" field={(s) => s.text2}    />
        <input type={'submit'}/>
      </form>
    </div>
  );
}
```
