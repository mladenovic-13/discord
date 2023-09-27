'use client';

import axios from 'axios';
import qs from 'query-string';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusIcon, SmileIcon } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { EmojiPicker } from '../emoji-picker';
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'channel' | 'conversation';
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const { onOpen } = useModal();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: '',
    },
    resolver: zodResolver(formSchema),
  });

  const isLoadiding = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, data);
      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button
                    type='button'
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className='absolute left-8 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300'
                  >
                    <PlusIcon className='text-white dark:text-[#313338]' />
                  </button>

                  <Input
                    disabled={isLoadiding}
                    className='border-0 border-none bg-zinc-200/90 px-14 py-6 outline-none focus-visible:ring-0 dark:bg-zinc-700/75'
                    placeholder={`Message ${
                      type === 'conversation' ? { name } : '#' + name
                    }`}
                    {...field}
                  />
                  <div className='absolute right-8 top-7'>
                    <EmojiPicker
                      onChange={(emoji) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
