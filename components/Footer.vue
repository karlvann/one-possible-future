<template>
  <footer>
    <section class="bg-grey-dark">
      <Container>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 pt-10 mx-auto">
          <div class="flex flex-col gap-8 flex-1">
            
            <div class="flex flex-col gap-3">
              <LogoLight class="w-[100px] sm:w-[130px]" />
              <div class="font-regular text-base leading-6.5 text-white/60"> 
                Really comfy mattresses<br>handmade on site
              </div>
            </div>
            
            <ul class="flex flex-col gap-3 flex-1 text-white">
              <li class="flex flex-row gap-3">
                <Icon name="ic:outline-email" class="size-5 translate-y-1" />
                <div>
                  <a href="mailto:sales@ausbeds.com.au" class="font-regular text-base leading-6.5 text-white/90 break-all">
                    sales@ausbeds.com.au
                  </a>
                </div>
              </li>
              <li class="flex flex-row gap-3">
                <Icon name="ic:round-whatsapp" class="size-5 translate-y-1" />
                <div class="font-regular text-base leading-6.5 text-white/90">
                  <div class="text-white/90">WhatsApp Us</div> 
                  <div class="text-white/60">
                    <a 
                    v-umami="'contact_whatsapp'"
                    href="https://wa.me/61450606589?text=Hello%2C%20I%27d%20like%20some%20more%20info%20about%20your%20mattresses%20please">
                      Send us a message
                    </a>
                  </div>
                  <div class="text-white/60">24/7, anytime</div>
                </div>
              </li>
              <li class="flex flex-row gap-3"> 
                <Icon name="ic:outline-phone" class="size-5 translate-y-1" /> 
                <div class="font-regular text-base leading-6.5 text-white/90">
                  <div class="text-white/90"><a href="tel:0289993333">Call (02) 8999 3333</a></div>
                  <div class="text-white/60">Mon–Fri: 10am – 6pm</div>
                  <div class="text-white/60">Sat–Sun: 10am – 2pm</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-8 flex-1 max-w-[280px]">
            <div class="flex flex-col gap-3">
              <div class="font-bold text-blue text-[22px] font-marker">
                Locations
              </div>
              <div class="font-regular text-base leading-6.5 text-white/60">
                <strong class="text-white/90">Showroom & Workshop</strong><br>
                136 Victoria Rd, Marrickville<br>
                Mon-Fri: 10am – 6pm<br>
                Sat-Sun: 10am – 2pm
              </div>
              <a
              href="https://maps.app.goo.gl/QmnBwujEYqQXhEWV8"
              class="font-regular text-base leading-6.5 text-white/90 inline"
              target="_blank"
              v-umami="{ name: 'directions', location: 'Marrickville' }"
              >
                Get directions ›
              </a>
            </div>
            <div class="flex flex-col gap-3">
              <div class="font-regular text-base leading-6.5 text-white/60">
                <strong class="text-white/90">Staffless Showroom</strong><br>
                94 Penshurst St, Willoughby<br>
                Every day: 6am – 8pm<br>
                There are no staff. Just push the door to enter.
              </div>
              <a
              href="https://maps.app.goo.gl/NHRPCLzkdppNSeRQA"
              class="font-regular text-base leading-6.5 text-white/90 inline"
              target="_blank"
              v-umami="{ name: 'directions', location: 'Willoughby' }"
              >
                Get directions ›
              </a>
            </div>
          </div>
          <div class="flex flex-col gap-8 flex-1">
            <div class="flex flex-col gap-3">
              <div class="font-bold text-blue text-[22px] font-marker">
                Shop
              </div>
              <ul>
                <li>
                  <NuxtLink to="/mattresses/cooper" class="font-regular text-base leading-6.5 text-white/90">
                    Cooper mattress
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/mattresses/aurora" class="font-regular text-base leading-6.5 text-white/90">
                    Aurora mattress
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/mattresses/cloud" class="font-regular text-base leading-6.5 text-white/90">
                    Cloud mattress
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/mattresses/base" class="font-regular text-base leading-6.5 text-white/90">
                    Bed base
                  </NuxtLink>
                </li>
              </ul>
              <div class="font-regular text-base leading-6.5 text-white/90">We accept:</div>
              <div class="flex flex-row gap-2 text-white">
                <Icon name="fontisto:visa" class="h-8 w-8" />
                <Icon name="fontisto:mastercard" class="h-8 w-8" />
                <Icon name="fontisto:american-express" class="h-8 w-8" />
                <Icon name="simple-icons:paypal" class="h-6 w-6 relative top-1" />
                <Icon name="simple-icons:afterpay" class="h-6 w-6 relative top-1" />
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div class="font-bold text-blue text-[22px] font-marker">
                About
              </div>
              <ul>
                <li>
                  <NuxtLink to="/about/our-story" class="font-regular text-base leading-6.5 text-white/90">
                    Our story
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/about/our-philosophy" class="font-regular text-base leading-6.5 text-white/90">
                    Our philosophy
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/about/how-it-works" class="font-regular text-base leading-6.5 text-white/90">
                    How it works
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/about/reviews" class="font-regular text-base leading-6.5 text-white/90">
                    Reviews
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/mattress-guide" class="font-regular text-base leading-6.5 text-white/90">
                    Guides & tips
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex flex-col gap-8 flex-1">
            <div class="flex flex-col gap-3">
              <div class="font-bold text-blue text-[22px] font-marker">
                Support
              </div>
              <ul>
                <li>
                  <NuxtLink to="/support/adjustment-options" class="font-regular text-base leading-6.5 text-white/90">
                    Adjustment options
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/adjustments" class="font-regular text-base leading-6.5 text-white/90">
                    Adjustment videos
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/half-half-mattress" class="font-regular text-base leading-6.5 text-white/90">
                    Half-half mattress
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/faqs" class="font-regular text-base leading-6.5 text-white/90">
                    FAQs
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/warranty" class="font-regular text-base leading-6.5 text-white/90">
                    Warranty
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/returns" class="font-regular text-base leading-6.5 text-white/90">
                    Returns
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/support/delivery" class="font-regular text-base leading-6.5 text-white/90">
                    Delivery
                  </NuxtLink>
                </li>
                <li class="mt-3 pt-3 border-t border-white/20">
                  <NuxtLink to="/help" class="font-regular text-base leading-6.5 text-white/90">
                    Help Centre
                  </NuxtLink>
                  <span class="text-xs text-white/40 block">Detailed policy info</span>
                </li>
                <li>
                  <NuxtLink to="/articles" class="font-regular text-base leading-6.5 text-white/90">
                    Articles
                  </NuxtLink>
                  <span class="text-xs text-white/40 block">Sleep tips & guides</span>
                </li>
              </ul>
            </div>
            <div class="flex flex-col gap-3">
              <div class="font-bold text-blue text-[22px] font-marker">
                Social
              </div>
              <div class="font-regular text-base leading-6.5 text-white/90">
                Connect with us:
              </div>
              <div class="flex flex-row gap-2 text-white">
                <a 
                v-umami="{ name: 'social_click', platform: 'Instagram' }"
                href="https://www.instagram.com/ausbeds/" target="_blank" aria-label="Follow us on Instagram">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 13"><path fill="currentColor" d="M7.125 3.605A3.163 3.163 0 0 1 10.27 6.75a3.145 3.145 0 0 1-3.145 3.145A3.128 3.128 0 0 1 3.98 6.75a3.145 3.145 0 0 1 3.145-3.145Zm0 5.196c1.121 0 2.023-.903 2.023-2.051a2.019 2.019 0 0 0-2.023-2.023c-1.148 0-2.05.902-2.05 2.023 0 1.148.929 2.05 2.05 2.05Zm3.992-5.305a.735.735 0 0 0-.738-.738.735.735 0 0 0-.738.738c0 .41.328.738.738.738s.738-.328.738-.738Zm2.078.738c.055 1.012.055 4.047 0 5.059-.054.984-.273 1.832-.984 2.57-.711.711-1.586.93-2.57.985-1.012.054-4.047.054-5.059 0-.984-.055-1.832-.274-2.57-.985-.711-.738-.93-1.586-.985-2.57-.054-1.012-.054-4.047 0-5.059.055-.984.274-1.859.985-2.57.738-.71 1.586-.93 2.57-.984C5.594.625 8.629.625 9.641.68c.984.054 1.859.273 2.57.984.71.711.93 1.586.984 2.57Zm-1.312 6.125c.328-.793.246-2.707.246-3.609 0-.875.082-2.79-.246-3.61-.219-.519-.63-.956-1.149-1.148-.82-.328-2.734-.246-3.609-.246-.902 0-2.816-.082-3.61.246A2.11 2.11 0 0 0 2.34 3.141c-.328.82-.246 2.734-.246 3.609 0 .902-.082 2.816.246 3.61.219.546.629.956 1.176 1.175.793.328 2.707.246 3.609.246.875 0 2.79.082 3.61-.246.519-.219.956-.629 1.148-1.176Z"></path></svg>
                </a>
                <a
                v-umami="{ name: 'social_click', platform: 'Facebook' }"
                href="https://www.facebook.com/Ausbeds/" target="_blank" aria-label="Follow us on Facebook">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 15"><path fill="currentColor" d="M14.281 7.75a6.773 6.773 0 0 1-5.742 6.7V9.718h1.586l.3-1.969H8.54V6.492c0-.547.274-1.066 1.121-1.066h.848V3.758s-.766-.137-1.531-.137c-1.532 0-2.543.957-2.543 2.652V7.75H4.71v1.969h1.723v4.73C3.18 13.957.719 11.141.719 7.75A6.78 6.78 0 0 1 7.5.969a6.78 6.78 0 0 1 6.781 6.781Z"></path></svg>
                </a>
                <a
                v-umami="{ name: 'social_click', platform: 'TikTok' }"
                href="https://www.tiktok.com/@ausbedsofficial" target="_blank" aria-label="Follow us on TikTok">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 15"><path fill="currentColor" d="M13 6.492c-1.23.028-2.379-.355-3.363-1.066v4.894c0 3.418-3.719 5.551-6.672 3.856-2.953-1.723-2.953-5.989 0-7.711a4.465 4.465 0 0 1 2.844-.547v2.46c-1.504-.491-2.954.849-2.625 2.38.355 1.531 2.214 2.133 3.39 1.066.41-.383.656-.93.656-1.504V.75h2.407c0 .219 0 .41.054.629a3.233 3.233 0 0 0 1.477 2.187A3.28 3.28 0 0 0 13 4.113v2.38Z"></path></svg>
                </a>
                <a 
                v-umami="{ name: 'social_click', platform: 'YouTube' }"
                href="https://www.youtube.com/@AusbedsTheMattressGuy" target="_blank" aria-label="Subscribe to us on YouTube">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 11"><path fill="currentColor" d="M15.262 2.168c.328 1.148.328 3.61.328 3.61s0 2.433-.328 3.609a1.824 1.824 0 0 1-1.313 1.312C12.773 11 8.125 11 8.125 11s-4.676 0-5.852-.3A1.824 1.824 0 0 1 .961 9.386C.633 8.21.633 5.777.633 5.777s0-2.46.328-3.609A1.86 1.86 0 0 1 2.273.828C3.45.5 8.125.5 8.125.5s4.648 0 5.824.328a1.86 1.86 0 0 1 1.313 1.34ZM6.594 7.992l3.883-2.215-3.883-2.215v4.43Z"></path></svg>
                </a>
                <a
                v-umami="{ name: 'social_click', platform: 'Reddit' }"
                href="https://www.reddit.com/user/karlatausbeds/" target="_blank" aria-label="Follow us on Reddit">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M7 0a7 7 0 1 1 0 14H1.014a.42.42 0 0 1-.297-.717L2.05 11.95A7 7 0 0 1 7 0Zm2.56 2.046c-.559 0-1.025.394-1.134.92a1.885 1.885 0 0 0-1.69 1.878c-1.025.043-1.962.335-2.705.796a1.635 1.635 0 1 0-1.692 2.774c.054 1.898 2.122 3.424 4.665 3.424 2.545 0 4.614-1.528 4.665-3.427a1.635 1.635 0 1 0-1.696-2.774c-.75-.464-1.698-.756-2.735-.795v-.004c0-.698.521-1.276 1.194-1.368A1.159 1.159 0 1 0 9.56 2.046Z" clip-rule="evenodd"></path><path fill="currentColor" d="M5.625 8.003c-.028.589-.421.803-.88.803-.458 0-.807-.32-.78-.908.028-.589.421-.974.88-.974.458 0 .807.491.78 1.08ZM8.384 8.003c.027.589.42.803.879.803.458 0 .807-.32.78-.908-.027-.589-.42-.974-.879-.974-.458 0-.807.491-.78 1.08ZM7.004 9.263c-.568 0-1.112.028-1.615.08a.129.129 0 0 0-.107.177 1.867 1.867 0 0 0 3.444 0 .13.13 0 0 0-.107-.178 16.054 16.054 0 0 0-1.615-.079Z"></path></svg>
                </a>
                <a
                v-umami="{ name: 'social_click', platform: 'OzBargain' }"
                href="https://www.ozbargain.com.au/user/77255" target="_blank" aria-label="Follow us on OzBargain">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path fill="currentColor" d="M12.293 2.561a.854.854 0 0 0-.854-.853H2.56a.854.854 0 0 0-.853.853v8.878c0 .471.382.854.853.854h8.878a.854.854 0 0 0 .854-.854V2.56ZM14 11.44A2.561 2.561 0 0 1 11.439 14H2.56A2.561 2.561 0 0 1 0 11.439V2.56A2.561 2.561 0 0 1 2.561 0h8.878A2.561 2.561 0 0 1 14 2.561v8.878Z"></path><path fill="currentColor" d="M7.52 7.94c0 .852-.02 1.456-.062 1.812a1.99 1.99 0 0 1-.377.968c-.21.293-.494.518-.853.675-.36.157-.778.236-1.256.236-.454 0-.862-.074-1.225-.22a2.031 2.031 0 0 1-.869-.67c-.22-.297-.35-.62-.392-.968-.042-.35-.063-.96-.063-1.832V6.49c0-.852.019-1.454.057-1.806.042-.356.168-.68.377-.974.213-.293.5-.518.859-.675.359-.157.778-.235 1.256-.235.453 0 .86.075 1.22.225.362.146.654.368.873.665.22.296.351.619.393.968.042.349.063.96.063 1.832v1.45ZM5.318 5.157c0-.394-.022-.645-.068-.754-.042-.111-.13-.167-.267-.167a.306.306 0 0 0-.267.136c-.06.087-.089.349-.089.785v3.957c0 .492.02.796.058.91.042.116.136.174.282.174.15 0 .247-.067.288-.2.042-.132.063-.448.063-.947V5.156ZM11.577 4.507v1.539l-1.56 4.014h1.56v1.393H7.971V9.998l1.596-4.099H8.133V4.507h3.444Z"></path></svg>
                </a>
                <a
                v-umami="{ name: 'social_click', platform: 'Whirlpool' }"
                href="https://forums.whirlpool.net.au/thread/3lqnypr9?r=76038370&u=903959#r76038370" target="_blank" aria-label="Follow us on Whirlpool Forums">
                  <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path fill="currentColor" d="M13.995 3.902v2.104c-.298-.106-1.252-.151-1.931.012.832.031 1.93.418 1.93 1.098v.389c-.297-.15-1.285-.109-1.56-.056.638-.049 1.56.366 1.56.742v1.827c-.595-.554-2.148-1.045-3.653-.76 1.125-.718 2.836-.762 3.612-.54-.715-.767-2.795-1.18-4.485-.65.835-.777 2.101-1.057 3.472-1.152-.862-.505-3.126-.394-4.957.382 1.29-1.245 3.302-2.247 5.492-1.936-1.511-.53-3.818-.372-5.505.375 1.076-1.177 3.062-1.656 4.513-1.448-1.903-.548-4.034-.395-6.088.683 3.08-2.452 7.6-1.07 7.6-1.07Zm-2.78 6.269c1.092-.148 1.774.05 2.443.574a3.391 3.391 0 0 0-1.672.065c.701.162 1.124.252 1.552.569-.731-.137-1.476-.012-2.18.24.69-.072 1.322.213 1.458.459.58-.265 1.03-.668 1.179-1.042v-.795c0-.34-1.596-.869-2.78-.07ZM12.282 0H1.786C.823 0 0 .7 0 1.663v10.502C0 13.127.823 14 1.786 14h3.067c-3.564-2.755-2.694-8.15.314-9.584-3.008 1.775-3.008 6.829-.374 8.59-.363-.707-.678-1.632-.527-2.502.42 2.72 3.123 3.31 3.123 3.31-.163-.155-.523-.592-.634-.843.958 1.025 2.715.96 4.112.771-.587-.105-1.235-.446-1.48-.777 1.783.704 3.22.554 4.597-.425.028-.06.01-.181.01-.274v-.774c-.893 1.703-5.753 1.841-6.105-.796-.345.607-.115 1.682.497 2.14-1.517-.145-2.154-2.281-1.235-3.634-.824.744-1.029 1.725-1.011 2.608-.937-1.337-.092-3.59.352-4.095-.589.262-1.212 1.06-1.573 1.892-.062-1.715.825-3.34 2.272-4.39-1.528.59-3.419 2.397-3.502 4.69-.736-4.356 3.926-8.05 10.305-6.051V1.663C13.994.7 13.246 0 12.283 0Z"></path></svg>
                </a>
              </div>
              <div class="mt-4">
                <a href="https://www.productreview.com.au/listings/ausbeds-1" target="_blank" v-umami="{ name: 'reviews_click', location: 'footer-simple' }">
                  <ProductReviewRatingSimple type="inline-rating-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
    <section class="bg-grey">
      <Container>
        <div class="py-4 smd:flex smd:flex-row justify-center text-white/60 leading-7 text-sm">
          <div>© Ausbeds 2025</div>
          <span class="hidden smd:inline-flex px-1 md:px-3">|</span>
          <div><NuxtLink to="/policies/terms" class="inline-block">Terms of Service</NuxtLink></div>
          <span class="hidden smd:inline-flex px-1 md:px-3">|</span>
          <div><NuxtLink to="/policies/privacy" class="inline-block">Privacy Policy</NuxtLink></div>
          <span class="hidden smd:inline-flex px-1 md:px-3">|</span>
          <div><NuxtLink to="/policies/cookie" class="inline-block">Cookies</NuxtLink></div>
          <span class="hidden smd:inline-flex px-1 md:px-3">|</span>
          <div><NuxtLink to="/policies/returns" class="inline-block">Returns</NuxtLink></div>
        </div>
      </Container>
    </section>
  </footer>
</template>

<style lang="scss" scoped>
a {
  text-decoration: underline;
}
</style>