interface ContactFormProps {
  email: string
  setEmail: (value: string) => void
  fullName: string
  setFullName: (value: string) => void
  phone: string
  setPhone: (value: string) => void
}

export function ContactForm({
  email,
  setEmail,
  fullName,
  setFullName,
  phone,
  setPhone
}: ContactFormProps) {
  return (
    <div className="space-y-3.5">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-0.5">Contact Information</h3>
        <p className="text-xs text-gray-600">We'll send your confirmation here</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
        />
      </div>
    </div>
  )
}
