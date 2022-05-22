import { extend } from "vee-validate";
import { required,min,max,regex ,between,digits } from "vee-validate/dist/rules";

extend("required", {
  ...required,
  message: '{_field_} is required.',
});

extend('min', {
  ...min,
  message: '{_field_} must at least {length} character.',
})

extend('max', {
  ...max,
  message: '{_field_} max length is {length} character.',
})

extend('regex', {
  ...regex,
  message: '{_field_} wrong.',
})

