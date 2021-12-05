import { Input, InputProps } from '@chakra-ui/input';
import { FormControl, FormLabel, FormErrorMessage, Textarea, TextareaProps } from '@chakra-ui/react';
import { FieldHookConfig, useField } from 'formik';
import React, { InputHTMLAttributes, useReducer } from 'react'


type InputFieldProps = TextareaProps & InputProps  & {
    label:string;
    name:string;
    textarea?: boolean;

};

export const InputField: React.FC<InputFieldProps> = ({textarea, label, ...props}) => {

        const [field, {error}] = useField(props.name);
        return (
            // !! cast string to boolean
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name} >{label}</FormLabel>
                {
                    !textarea ? <Input {...field} {...props} id={field.name}  /> : <Textarea {...field} {...props} id={field.name}  />
                    
                }
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
          </FormControl>
        );
}