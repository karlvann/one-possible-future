<template>
  <span 
  class="px-6 py-4 rounded-md font-semibold cursor-pointer"
  @click="deliveryInfoModal = true"
  v-umami="{ name: 'modal', info: 'Delivery' }"
  >
    Delivery info
  </span>
  <TransitionRoot as="template" :show="deliveryInfoModal">
    <Dialog as="div" class="relative z-10" @close="deliveryInfoModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-[rgba(0,0,0,0.7)] transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full justify-center p-4 text-center items-center">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-[10px] md:rounded-[16px] bg-[#f9f8f6] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div class="bg-[#f9f8f6] px-3 py-6 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div class="mb-4">
                  <DialogTitle as="h2" class="text-2xl font-bold mb-4">
                    Delivery information
                  </DialogTitle>
                  <button @click="deliveryInfoModal = false" class="absolute top-4 right-4 text-grey-dark hover:text-gray-500 focus-visible:none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="space-y-6">
                  <p class="mb-4">
                    We delivery to Sydney, Melbourne, Brisbane and Canberra metro areas, as well as regional addresses close to the highway. After making a purchase, we will contact you to confirm your delivery details and arrange a delivery date.
                  </p>

                  <div class="tabs">
                    <TabGroup :default-index="0">
                      <TabList class="tabs-buttons">
                        <Tab>Sydney</Tab>
                        <Tab>Brisbane, Melbourne, Canberra</Tab>
                        <Tab>Regional NSW, Vic, Qld</Tab>
                      </TabList>
                      <TabPanels class="bg-[#E8E8E8] px-2 py-3 rounded-md">
                        <TabPanel>
                          <ul class="pl-6 list-disc space-y-2">
                            <li>Delivery is calculated at a rate of $2 per km.</li>
                            <li>If you're within 15km of our Sydney factory, delivery is free.</li>
                            <li>Standard delivery includes one driver.</li>
                            <li>Legally, <strong>a two-person delivery is required if stairs are involved and the customer cannot safely assist</strong> (mattresses are heavy).</li>
                            <li>Two-person delivery is available Thu-Fri. Two-person deliveries are charged at $4 per km. If you're within 15km of our factory, two-person delivery is $50 total.</li>
                          </ul>
                        </TabPanel>
                        <TabPanel>
                          <ul class="pl-6 list-disc space-y-2">
                            <li>For Melbourne, Brisbane and Canberra metro areas, we charge a base rate of $190.</li>
                            <li>An additional $2 per km for deliveries over 15km from our depot.</li>
                            <li>We deliver up to 110km from our Melbourne, Brisbane and Canberra depots.</li>
                            <li>All deliveries include two people.</li>
                            <li>Frequency: We drive to Melbourne every week on a Tuesday. We drive to Brisbane every two weeks on a Tuesday. We drive to Canberra every two weeks, alternating with Canberra.</li>
                          </ul>
                        </TabPanel>
                        <TabPanel>
                          <ul class="pl-6 list-disc space-y-2">
                            <li>We drive from our Sydney factory to Melbourne every week on a Tuesday. We drive to Brisbane every two weeks on a Tuesday. We drive to Canberra every two weeks, alternating with Canberra.</li>
                            <li>We stop in regional areas of NSW, Victoria and Queensland if it is within 30km of the highway.</li>
                            <li>The base rate for these deliveries is $190 for up to 10km from the highway.</li>
                            <li>For deliveries over 10km and under 30km, we charge an additional $80.</li>
                            <li>All deliveries include two people.</li>
                            <li>To check if we deliver to your address, use the shipping estimator or call us for more information.</li>
                          </ul>
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>
                  </div>

                  <p class="mt-4">
                    For all enquiries, please call 02 8999 3333 or text 0450 606 589.
                  </p>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot, 
  TabGroup, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel 
} from '@headlessui/vue'

const deliveryInfoModal = ref(false)
</script>