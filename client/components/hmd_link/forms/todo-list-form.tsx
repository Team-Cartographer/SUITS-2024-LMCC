"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
  todoitem: z
    .string()
})

interface TodoProps {
    onFormSubmit: (data: z.infer<typeof FormSchema>) => void
}

export function TodoAreaForm({ onFormSubmit }: TodoProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onFormSubmit(data);
    form.reset({
      todoitem: '', 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row self-start space-x-2">
        <FormField
          control={form.control}
          name="todoitem"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="text-sm min-w-[400px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(); 
                    }}}
                  placeholder="Items Here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  )
}
