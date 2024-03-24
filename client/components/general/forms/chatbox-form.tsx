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
import { ArrowUp } from "lucide-react"

const FormSchema = z.object({
  chatItem: z
    .string()
})

interface TodoProps {
    onFormSubmit: (data: z.infer<typeof FormSchema>) => void
}

export function ChatboxForm({ onFormSubmit }: TodoProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    onFormSubmit(data);
    form.reset({
      chatItem: '', 
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row space-x-2">
        <FormField
          control={form.control}
          name="chatItem"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)(); 
                    }}}
                  className="min-w-[400px] resize-y"
                  placeholder="Message Gemini..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="p-2">
            <ArrowUp />
        </Button>
      </form>
    </Form>
  )
}
