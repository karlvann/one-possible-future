<template>

  <header 
  class="flex flex-col fixed w-full top-0 z-10"
  :class="{ 'shadow-lg' : scrollY > 50 }"
  >
    
    <!-- Xmas banner -->
    <div
    v-if="banner"
    class="bg-green-dark">
      <Container class="flex flex-row w-full py-2">
        <div class="flex-1 flex flex-row gap-2 items-center justify-center">
          <div
          class="hidden md:block text-sm text-white">
            Reduced trading hours over Christmas & the New Year. <NuxtLink to="/guides/ausbeds-holiday-trading-hours-2025"><span class="underline">See full schedule</span> →</NuxtLink>
          </div>
          <div
          class="md:hidden text-sm text-white">
            <NuxtLink to="/guides/ausbeds-holiday-trading-hours-2025"><span class="underline">See our holiday trading hours</span> →</NuxtLink>
          </div>
        </div>
      </Container>
    </div>

    <div class="bg-grey-dark hidden md:block">
      <Container class="flex flex-row w-full py-2">
        <div class="flex-1 flex flex-row gap-2 items-center">
          <Icon name="ic:baseline-location-on" class="size-5 text-white" />
          <div>
            <NuxtLink to="/showrooms" class="font-regular text-base leading-6.5 text-white/90 text-sm">
              Try a mattress in our Sydney Showrooms
            </NuxtLink>
          </div>
        </div>
        <a
        v-umami="'contact_whatsapp'"
        target="_blank"
        class="flex flex-row gap-2 items-center mr-8"
        href="https://wa.me/61450606589?text=Hello%2C%20I%27d%20like%20some%20more%20info%20about%20your%20mattresses%20please"
        >
          <Icon name="ri:whatsapp-fill" class="size-5 text-[#58BE55] " />
          <span class="font-regular text-base leading-6.5 text-white/90 text-sm">
            WhatsApp us
          </span>
        </a>
        <a
        v-umami="'contact_call'"
        class="flex flex-row gap-2 items-center"
        href="tel:0289993333">
          <Icon name="ri:phone-fill" class="size-5 text-white" />
          <span class="font-regular text-base leading-6.5 text-white/90 text-sm">
            Call 02 8999 3333
          </span>
        </a>
      </Container>
    </div>

    <div class="bg-white">
      <Container class="flex flex-row items-center justify-between py-2">
        <NuxtLink to="/" class="-ml-8 px-8 md:px-8 px-4" aria-label="Click to return to home page">
          <LogoDark class="w-[100px] sm:w-[130px] relative -top-[3px]" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <ul class="hidden lg:flex flex-1 flex-row justify-end h-full">
          <li class="px-8 py-4 h-full group">
            <div class="flex flex-row gap-2 items-center cursor-pointer">
              <span class="font-regular text-base leading-6.5 text-primary">
                Shop
              </span>
              <Icon name="ic:outline-keyboard-arrow-down" class="size-4 -mr-1.5 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div class="fixed -z-[1] left-0 top-[0] w-screen h-screen bg-[rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out pointer-events-none"></div>

            <!-- Dropdown panel -->
            <div 
            class="absolute left-0 top-[110px] w-screen -ml-[50vw] left-1/2 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform translate-y-0 group-hover:-translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50"
            :class="[
              pointerEventsNone ? 'hidden' : '',
              banner ? 'top-[145px]' : 'top-[110px]'
            ]"
            >
              <!--  opacity-0 invisible group-hover:opacity-100 group-hover: -->
              <Container class="pt-4 pb-8"> 
                <div class="grid grid-cols-5 gap-8">
                  <!-- Column 1: Text content -->
                  <div class="col-span-1 flex flex-col justify-center pr-4">
                    <h3 class="text-2xl font-bold text-primary mb-3">Shop mattresses</h3>
                    <p class="text-sm leading-relaxed">
                      Find your perfect sleep solution from our range of premium mattresses and bed bases.
                    </p>
                  </div>

                  <!-- Column 2: Cooper mattress -->
                  <div class="col-span-1">
                    <NuxtLink to="/mattresses/cooper" class="group/item block">
                      <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                        loading="lazy"
                        :src="useCdn('970b19fb-67cd-459d-a366-cc8f56518976', 'cooper-mattress-sm.jpg', 400, 400)"
                        alt="Cooper mattress"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <h4 class="font-semibold text-base text-primary mb-1 group-hover/item:text-blue transition-colors">Cooper</h4>
                      <p class="text-sm">Affordable comfort with customisable options</p>
                      <p class="text-sm mt-3">From $850</p>
                    </NuxtLink>
                  </div>

                  <!-- Column 3: Aurora mattress -->
                  <div class="col-span-1">
                    <NuxtLink to="/mattresses/aurora" class="group/item block">
                      <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                        loading="lazy"
                        :src="useCdn('893dfc33-3056-4a0f-9331-5abd7838c056', 'aurora-mattress-sm.jpg', 400, 400)"
                        alt="Aurora mattress"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <h4 class="font-semibold text-base text-primary mb-1 group-hover/item:text-blue transition-colors">Aurora</h4>
                      <p class="text-sm">Premium, natural materials with a flatter feel</p>
                      <p class="text-sm mt-3">From $1,700</p>
                    </NuxtLink>
                  </div>

                  <!-- Column 4: Cloud mattress -->
                  <div class="col-span-1">
                    <NuxtLink to="/mattresses/cloud" class="group/item block">
                      <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                        loading="lazy"
                        :src="useCdn('7fa5ba89-5730-44df-8bdf-816a1c755139', 'cloud-mattress-sm.jpg', 400, 400)"
                        alt="Cloud mattress"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <h4 class="font-semibold text-base text-primary mb-1 group-hover/item:text-blue transition-colors">Cloud</h4>
                      <p class="text-sm">Premium plushness for the ultimate comfort seeker</p>
                      <p class="text-sm mt-3">From $1,950</p>
                    </NuxtLink>
                  </div>

                  <!-- Column 5: Bed base -->
                  <div class="col-span-1">
                    <NuxtLink to="/mattresses/base" class="group/item block">
                      <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                        loading="lazy"
                        :src="useCdn('f57a3199-c1c1-49f8-ae32-84e95b19319f', 'bed-base-sm.jpg', 400, 400)"
                        alt="Bed base"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                      <h4 class="font-semibold text-base text-primary mb-1 group-hover/item:text-blue transition-colors">Bed base</h4>
                      <p class="text-sm">Our solid slimline base for your mattress</p>
                      <p class="text-sm mt-3">From $330</p>
                    </NuxtLink>
                  </div>
                </div>
              </Container>
            </div>

          </li>
          <li class="px-8 py-4 h-full group">
            <div class="flex flex-row gap-2 items-center cursor-pointer">
              <span class="font-regular text-base leading-6.5 text-primary">
                About
              </span>
              <Icon name="ic:outline-keyboard-arrow-down" class="size-4 -mr-1.5 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div class="fixed -z-[1] left-0 top-[0] w-screen h-screen bg-[rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out pointer-events-none"></div>

            <!-- Dropdown panel -->
            <div 
            class="absolute left-0 top-[110px] w-screen -ml-[50vw] left-1/2 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform translate-y-0 group-hover:-translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50"
            :class="[
              pointerEventsNone ? 'hidden' : '',
              banner ? 'top-[145px]' : 'top-[110px]'
            ]"
            >
              <Container class="pt-4 pb-8"> 
                <div class="grid grid-cols-2 gap-12 max-w-[700px] mx-auto">

                  <div class="col-span-1">
                    <h3 class="font-bold text-lg text-primary mb-4 pb-2 border-b border-grey-med-light">About Ausbeds</h3>
                    <ul class="gap-3 grid grid-cols-2">
                      <li>
                        <NuxtLink to="/about/our-story" class="text-base text-primary hover:text-blue transition-colors block">
                          Our story
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/about/our-philosophy" class="text-base text-primary hover:text-blue transition-colors block">
                          Our philosophy
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/about/how-it-works" class="text-base text-primary hover:text-blue transition-colors block">
                          How it works
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/about/reviews" class="text-base text-primary hover:text-blue transition-colors block">
                          Reviews
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>

                  <div class="col-span-1">
                    <h3 class="font-bold text-lg text-primary mb-4 pb-2 border-b border-grey-med-light">Showrooms</h3>
                    <ul class="space-y-3">
                      <li>
                        <NuxtLink to="/showrooms/marrickville" class="text-base text-primary hover:text-blue transition-colors block">
                          Marrickville workshop
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/showrooms/willoughby" class="text-base text-primary hover:text-blue transition-colors block">
                          Willoughby staffless showroom
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>

                </div>
              </Container>
            </div>
          </li>
          <li class="px-8 py-4 h-full group">
            <div class="flex flex-row gap-2 items-center cursor-pointer">
              <span class="font-regular text-base leading-6.5 text-primary">
                Support
              </span>
              <Icon name="ic:outline-keyboard-arrow-down" class="size-4 -mr-1.5 transition-transform duration-300 group-hover:rotate-180" />
            </div>

            <div class="fixed -z-[1] left-0 top-[0] w-screen h-screen bg-[rgba(0,0,0,0.7)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out pointer-events-none"></div>

            <!-- Dropdown panel -->
            <div 
            class="absolute left-0 top-[110px] w-screen -ml-[50vw] left-1/2 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform translate-y-0 group-hover:-translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50"
            :class="[
              pointerEventsNone ? 'hidden' : '',
              banner ? 'top-[145px]' : 'top-[110px]'
            ]"
            >
              <Container class="pt-4 pb-8"> 
                <div class="grid grid-cols-3 gap-12 max-w-[700px] mx-auto">

                  <!-- Column 2: Support -->
                  <div class="col-span-3">
                    <h3 class="font-bold text-lg text-primary mb-4 pb-2 border-b border-grey-med-light">Support</h3>
                    <ul class="grid gap-3 grid-cols-3">
                      <li>
                        <NuxtLink to="/support/adjustment-options" class="text-base text-primary hover:text-blue transition-colors block">
                          Adjustment options
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/adjustments" class="text-base text-primary hover:text-blue transition-colors block">
                          Adjustment videos
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/half-half-mattress" class="text-base text-primary hover:text-blue transition-colors block">
                          Half-half mattress
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/faqs" class="text-base text-primary hover:text-blue transition-colors block">
                          FAQs
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/warranty" class="text-base text-primary hover:text-blue transition-colors block">
                          Warranty
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/delivery" class="text-base text-primary hover:text-blue transition-colors block">
                          Delivery
                        </NuxtLink>
                      </li>
                      <li>
                        <NuxtLink to="/support/returns" class="text-base text-primary hover:text-blue transition-colors block">
                          Returns
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </Container>
            </div>
          </li>
          <li class="relative px-8 py-4">
            <div class="flex flex-row gap-2 items-center cursor-pointer">
              <NuxtLink 
              to="/mattress-guide"
              class="font-regular text-base leading-6.5 text-primary"
              >
                Guides & tips
              </NuxtLink>
            </div>
          </li>
          <li class="relative pl-8 py-4">
             <button class="relative flex items-center" aria-label="Cart" @click="cartStore.toggleCartOpen()">
              <Icon name="ic:outline-shopping-cart" class="size-6 cursor-pointer text-primary" />
              <span
              v-if="itemCount > 0"
              class="absolute -top-[10px] -right-[10px] bg-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ itemCount }}
              </span>
            </button>
          </li>
        </ul>

        <!-- Mobile: Cart + Hamburger -->
        <div class="flex lg:hidden items-center gap-2">

          <a
          v-umami="'contact_whatsapp'"
          target="_blank"
          class="relative w-[32px] h-[32px] flex items-center md:hidden"
          href="https://wa.me/61450606589?text=Hello%2C%20I%27d%20like%20some%20more%20info%20about%20your%20mattresses%20please">
            <Icon name="ri:whatsapp-fill" class="size-6 text-[#58BE55]" />
          </a>
          
          <!--Cart button-->
          <button class="relative w-[32px] h-[32px] flex items-center" aria-label="Cart" @click="cartStore.toggleCartOpen()">
            <Icon name="ic:outline-shopping-cart" class="size-6 cursor-pointer text-primary" />
            <span
            v-if="itemCount > 0"
            class="absolute -top-[6px] -right-[3px] bg-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ itemCount }}
            </span>
          </button>

          <button
          @click="toggleMobileMenu"
          class="w-8 h-8 flex flex-col justify-center items-center gap-[6px] cursor-pointer"
          aria-label="Toggle menu"
          >
            <span
            class="w-6 h-[2px] bg-black rounded-full transition-all duration-300 ease-in-out"
            :class="{ 'rotate-45 translate-y-[0.25rem]': mobileMenu, 'rotate-0 translate-y-0': !mobileMenu }"
            ></span>
            <span
            class="w-6 h-[2px] bg-black rounded-full transition-all duration-300 ease-in-out"
            :class="{ '-rotate-45 -translate-y-[0.25rem]': mobileMenu, 'rotate-0 translate-y-0': !mobileMenu }"
            ></span>
          </button>
        </div>
      </Container>

      <!-- Mobile Menu -->
      <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      >
        <div 
        v-show="mobileMenu" 
        class="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t border-grey-med-light overflow-y-auto overscroll-contain"
        :style="{ top: mobileMenuTop }"
        >
          <Container class="py-6">
            <nav class="flex flex-col gap-6">
              <!-- Shop Section -->
              <div>
                <button
                @click="toggleShopMenu"
                class="flex items-center justify-between w-full text-left font-semibold text-lg text-primary pb-3 border-b border-grey-med-light"
                >
                  Shop
                  <Icon
                  name="ic:outline-keyboard-arrow-down"
                  class="size-5 transition-transform duration-300"
                  :class="{ 'rotate-180': shopMenuOpen }"
                  />
                </button>
                <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[800px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[800px]"
                leave-to-class="opacity-0 max-h-0"
                >
                  <div v-show="shopMenuOpen" class="overflow-hidden">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <NuxtLink to="/mattresses/cooper" class="block" @click="mobileMenu = false">
                        <div class="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                          <img
                          loading="lazy"
                          :src="useCdn('970b19fb-67cd-459d-a366-cc8f56518976', 'cooper-mattress-sm.jpg', 300, 300)"
                          alt="Cooper mattress"
                          class="w-full h-full object-cover"
                          />
                        </div>
                        <h4 class="font-semibold text-sm sm:text-base text-primary">Cooper</h4>
                        <p class="text-xs sm:text-sm my-1">Affordable comfort with customisable options</p>
                        <p class="text-xs sm:text-sm">From $850</p>
                      </NuxtLink>

                      <NuxtLink to="/mattresses/aurora" class="block" @click="mobileMenu = false">
                        <div class="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                          <img
                          loading="lazy"
                          :src="useCdn('893dfc33-3056-4a0f-9331-5abd7838c056', 'aurora-mattress-sm.jpg', 300, 300)"
                          alt="Aurora mattress"
                          class="w-full h-full object-cover"
                          />
                        </div>
                        <h4 class="font-semibold text-sm sm:text-base text-primary">Aurora</h4>
                        <p class="text-xs sm:text-sm my-1">Premium, natural materials with a flatter feel</p>
                        <p class="text-xs sm:text-sm">From $1,700</p>
                      </NuxtLink>

                      <NuxtLink to="/mattresses/cloud" class="block" @click="mobileMenu = false">
                        <div class="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                          <img
                          loading="lazy"
                          :src="useCdn('7fa5ba89-5730-44df-8bdf-816a1c755139', 'cloud-mattress-sm.jpg', 300, 300)"
                          alt="Cloud mattress"
                          class="w-full h-full object-cover"
                          />
                        </div>
                        <h4 class="font-semibold text-sm sm:text-base text-primary">Cloud</h4>
                        <p class="text-xs sm:text-sm my-1">Premium plushness for the ultimate comfort seeker</p>
                        <p class="text-xs sm:text-sm">From $1,950</p>
                      </NuxtLink>

                      <NuxtLink to="/mattresses/base" class="block" @click="mobileMenu = false">
                        <div class="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                          <img
                          loading="lazy"
                          :src="useCdn('f57a3199-c1c1-49f8-ae32-84e95b19319f', 'bed-base-sm.jpg', 300, 300)"
                          alt="Bed base"
                          class="w-full h-full object-cover"
                          />
                        </div>
                        <h4 class="font-semibold text-sm sm:text-base text-primary">Bed Base</h4>
                        <p class="text-xs sm:text-sm my-1">Our solid slimline base for your mattress</p>
                        <p class="text-xs sm:text-sm">From $330</p>
                      </NuxtLink>
                    </div>
                  </div>
                </Transition>
              </div>

              <div>
                <button
                @click="toggleAboutMenu"
                class="flex items-center justify-between w-full text-left font-semibold text-lg text-primary pb-3 border-b border-grey-med-light"
                >
                  About
                  <Icon
                  name="ic:outline-keyboard-arrow-down"
                  class="size-5 transition-transform duration-300"
                  :class="{ 'rotate-180': aboutMenuOpen }"
                  />
                </button>
                <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[800px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[800px]"
                leave-to-class="opacity-0 max-h-0"
                >
                  <div v-show="aboutMenuOpen" class="overflow-hidden">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      
                      <div>
                        <div class="space-y-2 text-sm sm:text-base">
                          <NuxtLink to="/about/our-story" class="block py-1" @click="mobileMenu = false">
                            Our story
                          </NuxtLink>
                          <NuxtLink to="/about/our-philosophy" class="block py-1" @click="mobileMenu = false">
                            Our philosophy
                          </NuxtLink>
                          <NuxtLink to="/about/how-it-works" class="block py-1" @click="mobileMenu = false">
                            How it works
                          </NuxtLink>
                          <NuxtLink to="/about/reviews" class="block py-1" @click="mobileMenu = false">
                            Reviews
                          </NuxtLink>
                        </div>
                      </div>

                    </div>
                  </div>
                </Transition>
              </div>

              <div>
                <button
                @click="toggleSupportMenu"
                class="flex items-center justify-between w-full text-left font-semibold text-lg text-primary pb-3 border-b border-grey-med-light"
                >
                  Support
                  <Icon
                  name="ic:outline-keyboard-arrow-down"
                  class="size-5 transition-transform duration-300"
                  :class="{ 'rotate-180': supportMenuOpen }"
                  />
                </button>
                <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[800px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[800px]"
                leave-to-class="opacity-0 max-h-0"
                >
                  <div v-show="supportMenuOpen" class="overflow-hidden">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div>
                        <div class="space-y-2 text-sm sm:text-base">
                          <NuxtLink to="/support/adjustment-options" class="block py-1" @click="mobileMenu = false">
                            Adjustment options
                          </NuxtLink>
                          <NuxtLink to="/support/adjustments" class="block py-1" @click="mobileMenu = false">
                            Adjustment videos
                          </NuxtLink>
                          <NuxtLink to="/support/half-half-mattress" class="block py-1" @click="mobileMenu = false">
                            Half-half mattress
                          </NuxtLink>
                          <NuxtLink to="/support/faqs" class="block py-1" @click="mobileMenu = false">
                            FAQs
                          </NuxtLink>
                          <NuxtLink to="/support/warranty" class="block py-1" @click="mobileMenu = false">
                            Warranty
                          </NuxtLink>
                          <NuxtLink to="/support/delivery" class="block py-1" @click="mobileMenu = false">
                            Delivery
                          </NuxtLink>
                          <NuxtLink to="/support/returns" class="block py-1" @click="mobileMenu = false">
                            Returns
                          </NuxtLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <div>
                <button
                @click="toggleShowroomsMenu"
                class="flex items-center justify-between w-full text-left font-semibold text-lg text-primary pb-3 border-b border-grey-med-light"
                >
                  Showrooms
                  <Icon
                  name="ic:outline-keyboard-arrow-down"
                  class="size-5 transition-transform duration-300"
                  :class="{ 'rotate-180': showroomsMenuOpen }"
                  />
                </button>
                <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[800px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[800px]"
                leave-to-class="opacity-0 max-h-0"
                >
                  <div v-show="showroomsMenuOpen" class="overflow-hidden">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div>
                        <div class="space-y-2 text-sm sm:text-base">
                          <NuxtLink to="/showrooms/marrickville" class="block py-1" @click="mobileMenu = false">
                            Marrickville workshop
                          </NuxtLink>
                          <NuxtLink to="/showrooms/willoughby" class="block py-1" @click="mobileMenu = false">
                            Willoughby staffless showroom
                          </NuxtLink>
                        </div>
                  
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <NuxtLink
              to="/mattress-guide"
              class="font-semibold text-lg text-primary pb-3 border-b border-grey-med-light"
              @click="mobileMenu = false"
              >
                Guides & tips
              </NuxtLink>
            </nav>
          </Container>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
const cartStore = useCartStore()
const route = useRoute()

const { itemCount } = storeToRefs(cartStore)

const panel = ref(null)
const currentUrl = ref('')

const windowWidth = ref(0)

const mobileMenu = ref(false)
const shopMenuOpen = ref(true)
const aboutMenuOpen = ref(false)
const supportMenuOpen = ref(false)
const showroomsMenuOpen = ref(false)

const settingsStore = useSettingsStore()
const { banner } = storeToRefs(settingsStore)

const scrollY = ref(0)

const toggleShopMenu = () => {
  shopMenuOpen.value = !shopMenuOpen.value
}

const toggleAboutMenu = () => {
  aboutMenuOpen.value = !aboutMenuOpen.value
}

const toggleSupportMenu = () => {
  supportMenuOpen.value = !supportMenuOpen.value
}

const toggleShowroomsMenu = () => {
  showroomsMenuOpen.value = !showroomsMenuOpen.value
}

const pointerEventsNone = ref(false)

const unfocus = () => {
  pointerEventsNone.value = true
  setTimeout(() => {
    pointerEventsNone.value = false
  }, 100)
}

const mobileMenuTop = computed(() => {
  if (banner.value) {
    if (windowWidth.value >= 960) {
      return '167px'
    }
    if (windowWidth.value >= 768) {
      return '132px'
    }
    return '93px'
  }
  return windowWidth.value >= 768 ? '97px' : '57px'
})


watchEffect(() => {
  currentUrl.value = route.fullPath
  panel.value = null
  mobileMenu.value = false
  if (process.client) {
    document.documentElement.classList.remove('lock')
    unfocus()
  }
})

const toggleMobileMenu = () => {
  if (mobileMenu.value) {
    mobileMenu.value = false
    document.documentElement.classList.remove('lock')
  } else {
    mobileMenu.value = true
    document.documentElement.classList.add('lock')
  }
}

const updateScrollY = () => {
  scrollY.value = window.scrollY
}

const updateScreenWidth = () => {
  if (windowWidth.value === window.innerWidth) return
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 960) {
    document.documentElement.classList.remove('lock')
  } else {
    if (mobileMenu.value) {
      document.documentElement.classList.add('lock')
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollY)
  window.addEventListener('resize', updateScreenWidth)
  windowWidth.value = window.innerWidth
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollY)
  window.removeEventListener('resize', updateScrollY)
})
</script>