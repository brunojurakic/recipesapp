type ErrorTypes = Record<string, string>

const errorMessages: ErrorTypes = {
  USER_ALREADY_EXISTS: "Korisnik s ovim emailom već postoji",
  INVALID_EMAIL: "Neispravna email adresa",
  INVALID_PASSWORD: "Neispravna lozinka",
  INVALID_EMAIL_OR_PASSWORD: "Neispravna email adresa ili lozinka",
  WEAK_PASSWORD: "Lozinka je previše slaba",
  PASSWORD_TOO_SHORT: "Lozinka je prekratka",
  PASSWORD_TOO_WEAK: "Lozinka je previše slaba",
  INVALID_CREDENTIALS: "Neispravni podaci za prijavu",
  AUTHENTICATION_FAILED: "Autentifikacija nije uspjela",
  LOGIN_FAILED: "Prijava nije uspjela",
  USER_NOT_FOUND: "Korisnik nije pronađen",
  ACCOUNT_NOT_VERIFIED: "Račun nije potvrđen",
  TOO_MANY_REQUESTS: "Previše zahtjeva. Molimo pokušajte kasnije",
  INVALID_TOKEN: "Neispravni token",
  EXPIRED_TOKEN: "Token je istekao",
  INVALID_VERIFICATION_CODE: "Neispravni kod za potvrdu",
  VERIFICATION_CODE_EXPIRED: "Kod za potvrdu je istekao",
  INVALID_RESET_TOKEN: "Neispravni token za resetiranje",
  RESET_TOKEN_EXPIRED: "Token za resetiranje je istekao",
  PASSWORD_MISMATCH: "Lozinke se ne podudaraju",
  INVALID_IMAGE: "Neispravna slika",
  IMAGE_TOO_LARGE: "Slika je prevelika",
  UNSUPPORTED_IMAGE_TYPE: "Nepodržani tip slike",
  ACCOUNT_LOCKED: "Račun je zaključan",
  INVALID_INPUT: "Neispravni unos",
  INTERNAL_SERVER_ERROR: "Greška na serveru",
  NETWORK_ERROR: "Greška mreže",
  UNKNOWN_ERROR: "Nepoznata greška",
  FAILED_TO_CREATE_USER: "Nije moguće stvoriti korisnika",
  FAILED_TO_CREATE_SESSION: "Nije moguće stvoriti sesiju",
  FAILED_TO_UPDATE_USER: "Nije moguće ažurirati korisnika",
  FAILED_TO_GET_SESSION: "Nije moguće dohvatiti sesiju",
  ACCOUNT_NOT_FOUND: "Račun nije pronađen",
  EMAIL_ALREADY_EXISTS: "Korisnik s ovim emailom već postoji",
  EMAIL_IN_USE: "Email se već koristi",
}

export const getCroatianErrorMessage = (
  errorCode: string,
  fallbackMessage?: string,
): string => {
  if (errorCode && errorCode in errorMessages) {
    return errorMessages[errorCode as keyof typeof errorMessages]
  }

  if (fallbackMessage) {
    const translated = translateCommonErrors(fallbackMessage)
    if (translated !== fallbackMessage) {
      return translated
    }
  }

  return fallbackMessage || "Dogodila se greška"
}

export const translateCommonErrors = (message: string): string => {
  const commonTranslations: Record<string, string> = {
    "User already exists": "Korisnik s ovim emailom već postoji",
    "Invalid email": "Neispravna email adresa",
    "Invalid password": "Neispravna lozinka",
    "Invalid email or password": "Neispravna email adresa ili lozinka",
    "Incorrect email or password": "Neispravna email adresa ili lozinka",
    "Wrong email or password": "Neispravna email adresa ili lozinka",
    "Email or password is incorrect": "Email adresa ili lozinka je neispravna",
    "Login failed": "Prijava nije uspjela",
    "Authentication failed": "Autentifikacija nije uspjela",
    "User not found": "Korisnik nije pronađen",
    "Invalid credentials": "Neispravni podaci za prijavu",
    "Too many requests": "Previše zahtjeva. Molimo pokušajte kasnije",
    "Account not verified": "Račun nije potvrđen",
    "Token expired": "Token je istekao",
    "Invalid token": "Neispravni token",
    "Password too weak": "Lozinka je previše slaba",
    "Password too short": "Lozinka je prekratka",
    "Password is too short": "Lozinka je prekratka",
    "Password must be at least": "Lozinka mora imati najmanje",
    "characters long": "znakova",
    "Passwords do not match": "Lozinke se ne podudaraju",
    "Internal server error": "Greška na serveru",
    "Network error": "Greška mreže",
    "Bad request": "Neispravni zahtjev",
    Unauthorized: "Nemate dozvolu za pristup",
    Forbidden: "Pristup je zabranjen",
    "Not found": "Nije pronađeno",
    "Connection failed": "Povezivanje nije uspjelo",
    Timeout: "Isteklo je vrijeme čekanja",
    "Email already exists": "Email već postoji",
    "Email is already in use": "Email se već koristi",
    "This email is already registered": "Ovaj email je već registriran",
    "Password validation failed": "Provjera lozinke nije uspjela",
    "Weak password": "Slaba lozinka",
    "Password strength is insufficient": "Jačina lozinke nije dovoljna",
  }

  if (commonTranslations[message]) {
    return commonTranslations[message]
  }

  for (const [english, croatian] of Object.entries(commonTranslations)) {
    if (message.toLowerCase().includes(english.toLowerCase())) {
      return croatian
    }
  }

  const passwordLengthPattern =
    /password.*must.*be.*at.*least.*(\d+).*characters/i
  const passwordLengthMatch = message.match(passwordLengthPattern)
  if (passwordLengthMatch) {
    const minLength = passwordLengthMatch[1]
    return `Lozinka mora imati najmanje ${minLength} znakova`
  }

  if (
    message.toLowerCase().includes("password") &&
    (message.toLowerCase().includes("short") ||
      message.toLowerCase().includes("length") ||
      message.toLowerCase().includes("minimum"))
  ) {
    return "Lozinka je prekratka"
  }

  if (
    message.toLowerCase().includes("email") &&
    (message.toLowerCase().includes("exist") ||
      message.toLowerCase().includes("use") ||
      message.toLowerCase().includes("taken"))
  ) {
    return "Korisnik s ovim emailom već postoji"
  }

  if (
    (message.toLowerCase().includes("email") ||
      message.toLowerCase().includes("password")) &&
    (message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("incorrect") ||
      message.toLowerCase().includes("wrong") ||
      message.toLowerCase().includes("failed"))
  ) {
    return "Neispravna email adresa ili lozinka"
  }

  return message
}

export const getTranslatedError = (
  errorCode?: string,
  errorMessage?: string,
): string => {
  if (errorCode) {
    const translation = getCroatianErrorMessage(errorCode, errorMessage)
    if (translation !== (errorMessage || "Dogodila se greška")) {
      return translation
    }
  }

  if (errorMessage) {
    return translateCommonErrors(errorMessage)
  }

  return "Dogodila se greška"
}
