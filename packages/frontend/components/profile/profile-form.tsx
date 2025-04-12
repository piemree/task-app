"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { updateUser } from "@/lib/redux/slices/authSlice"

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "Ad alanı zorunludur.",
  }),
  lastName: z.string().min(1, {
    message: "Soyad alanı zorunludur.",
  }),
  email: z
    .string()
    .email({
      message: "Geçerli bir e-posta adresi girin.",
    })
    .readonly(),
})

export function ProfileForm() {
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const { user, isLoading } = useAppSelector((state) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      })
    }
  }, [user, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return

    try {
      dispatch(
        updateUser({
          ...user,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      )

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profil güncellenemedi",
        description: "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ad</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soyad</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>E-posta adresi değiştirilemez.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Güncelleniyor..." : "Profili Güncelle"}
        </Button>
      </form>
    </Form>
  )
}
