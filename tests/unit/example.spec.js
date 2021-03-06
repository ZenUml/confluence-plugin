import { shallowMount } from '@vue/test-utils'
import GetSupport from '@/components/GetSupport.vue'

describe('GetSupport.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Get support'
    const wrapper = shallowMount(GetSupport, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
