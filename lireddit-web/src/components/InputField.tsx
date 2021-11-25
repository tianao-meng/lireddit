import { Input, InputProps } from '@chakra-ui/input';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { FieldHookConfig, useField } from 'formik';
import React, { InputHTMLAttributes, useReducer } from 'react'


type InputFieldProps = InputProps & {
    label:string;
    name:string;

};

export const InputField: React.FC<InputFieldProps> = ({label, ...props}) => {

        const [field, {error}] = useField(props.name);
        return (
            // !! cast string to boolean
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name} >{label}</FormLabel>
                <Input {...field} {...props} id={field.name}  />
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
          </FormControl>
        );
}