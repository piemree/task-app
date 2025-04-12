"use client"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { createProject } from "@/lib/redux/slices/projectSlice"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Proje adı zorunludur.",
  }),
  description: z.string().optional(),
})

export function NewProjectForm() {
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.projects)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await dispatch(createProject(values)).unwrap()
      toast({
        title: "Proje oluşturuldu",
        description: "Proje başarıyla oluşturuldu.",
      })
      router.push(`/dashboard/projects/${result._id}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Proje oluşturulamadı",
        description: "Proje oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proje Adı</FormLabel>
              <FormControl>
                <Input placeholder="Web Uygulaması" {...field} />
              </FormControl>
              <FormDescription>Projenizin adı. Bu, projenizi tanımlamak için kullanılacaktır.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea placeholder="Projenizin açıklaması..." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Projenizin kısa bir açıklaması. Bu isteğe bağlıdır.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Oluşturuluyor..." : "Proje Oluştur"}
        </Button>
      </form>
    </Form>
  )
}
