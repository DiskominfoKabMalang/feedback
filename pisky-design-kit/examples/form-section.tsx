/**
 * Pisky Design System - Form Section Example
 *
 * Pattern untuk form dengan sections.
 *
 * Usage:
 * Copy ke komponen Anda dan modifikasi fields.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface FormSection {
  title: string
  description?: string
  fields: FormField[]
}

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea'
  placeholder?: string
  required?: boolean
}

interface FormSectionsProps {
  sections: FormSection[]
  submitLabel?: string
  onCancel?: () => void
}

export function FormSections({
  sections,
  submitLabel = 'Save Changes',
  onCancel,
}: FormSectionsProps) {
  return (
    <form className="space-y-6">
      {sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && (
              <CardDescription>{section.description}</CardDescription>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

/* ============================================
   USAGE EXAMPLE
   ============================================ */
/*
import { FormSections } from '@/components/examples/form-section'

export default function SettingsPage() {
  const sections = [
    {
      title: 'Profile Information',
      description: 'Update your personal information',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          placeholder: 'John Doe',
          required: true,
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'john@example.com',
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          placeholder: '+1 234 567 890',
        },
      ],
    },
    {
      title: 'Security',
      description: 'Update your password',
      fields: [
        {
          name: 'currentPassword',
          label: 'Current Password',
          type: 'password',
          required: true,
        },
        {
          name: 'newPassword',
          label: 'New Password',
          type: 'password',
        },
        {
          name: 'confirmPassword',
          label: 'Confirm New Password',
          type: 'password',
        },
      ],
    },
  ]

  return (
    <div className="max-w-3xl">
      <FormSections
        sections={sections}
        submitLabel="Save Changes"
        onCancel={() => console.log('cancel')}
      />
    </div>
  )
}
*/
