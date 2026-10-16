declare module 'next' {
  export type Metadata = any;
  export type Viewport = any;
  export namespace MetadataRoute {
    export type Robots = any;
    export type Sitemap = any;
  }
  const next: any;
  export default next;
}

declare module 'next/server' {
  export class NextRequest extends Request {
    [key: string]: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(init?: any): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    [key: string]: any;
  }
}

declare module 'next/server.js' {
  export class NextRequest extends Request {
    [key: string]: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(init?: any): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    [key: string]: any;
  }
}

declare module 'next/image' {
  import { ComponentType, ImgHTMLAttributes } from 'react';
  export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string | any;
    alt: string;
    width?: number | `${number}`;
    height?: number | `${number}`;
    fill?: boolean;
    quality?: number | `${number}`;
    priority?: boolean;
    loading?: 'eager' | 'lazy';
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
  }
  const Image: ComponentType<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes } from 'react';
  export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
  }
  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/dist/*' {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  const content: any;
  export default content;
}

declare module 'three' {
  const content: any;
  export = content;
}

declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  export const GLTFLoader: any;
}

declare module 'three/examples/jsm/controls/OrbitControls.js' {
  export const OrbitControls: any;
}

declare module 'three/*' {
  const content: any;
  export default content;
}
