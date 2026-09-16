export const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    logoPlacement: "none" as const,
  },
  variables: {
    colorPrimary: "#a4161a",
    colorDanger: "#dc2626",
    colorSuccess: "#16a34a",
    colorWarning: "#f59e0b",
    colorNeutral: "#111827",
    colorText: "#111827",
    colorTextSecondary: "#4b5563",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#111827",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    borderRadius: "0.75rem",
    fontSize: "0.9375rem",
  },
  elements: {
    rootBox: "w-full max-w-[440px] mx-auto",
    cardBox: "w-full shadow-none",
    card: "w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/90 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08)] p-6 sm:p-8",
    headerTitle:
      "text-[26px] font-bold text-charcoal tracking-tight text-center",
    headerSubtitle:
      "text-sm text-muted-foreground text-center mt-1.5 leading-relaxed",
    socialButtonsBlockButton:
      "h-11 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 font-medium text-charcoal text-sm transition-all shadow-none flex items-center justify-center gap-2.5 active:scale-[0.99]",
    socialButtonsBlockButtonText: "font-semibold text-sm text-charcoal",
    socialButtonsProviderIcon: "w-5 h-5",
    dividerRow: "my-5 flex items-center",
    dividerLine: "bg-gray-200 h-px",
    dividerText:
      "text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 bg-white",
    formFieldLabel:
      "text-xs font-semibold text-charcoal tracking-wide uppercase mb-1.5",
    formFieldInput:
      "h-11 rounded-xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all px-3.5 text-charcoal placeholder:text-gray-400 shadow-none",
    formFieldInputShowPasswordButton:
      "text-muted-foreground hover:text-charcoal transition-colors",
    formButtonPrimary:
      "h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(164,22,26,0.25)] active:scale-[0.99]",
    formFieldAction:
      "text-xs font-semibold text-primary hover:text-primary-dark transition-colors hover:underline",
    footer: "border-t border-gray-100 pt-5 mt-6",
    footerAction: "flex items-center justify-center gap-1.5 text-sm",
    footerActionText: "text-sm text-muted-foreground",
    footerActionLink:
      "text-primary hover:text-primary-dark font-semibold text-sm hover:underline transition-colors",
    identityPreview:
      "bg-surface border border-gray-200 rounded-xl p-3 flex items-center justify-between",
    identityPreviewText: "text-sm font-medium text-charcoal",
    identityPreviewEditButton:
      "text-primary hover:text-primary-dark text-xs font-semibold hover:underline",
    formFieldErrorText: "text-xs text-red-600 mt-1 font-medium",
    formFieldSuccessText: "text-xs text-emerald-600 mt-1 font-medium",
    alert:
      "rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs p-3",
    alertText: "text-red-700 text-xs font-medium",
    otpCodeFieldInput:
      "rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-lg font-semibold text-charcoal",
    userButtonPopoverCard:
      "shadow-xl border border-gray-200/80 rounded-2xl p-2 bg-white",
    userButtonPopoverActionButton:
      "hover:bg-gray-50 rounded-xl transition-colors text-charcoal",
    userButtonPopoverActionButtonText: "text-sm font-medium text-charcoal",
    userButtonPopoverFooter: "border-t border-gray-100 mt-2 pt-2",
  },
};
