import Image from 'next/image'
import { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Add custom components here
    Image: (props) => (
      <Image
        {...props}
        width={props.width || 800}
        height={props.height || 400}
        alt={props.alt || ''}
        className={props.className || ''}
      />
    ),
    // Merge with passed components
    ...components,
  }
} 