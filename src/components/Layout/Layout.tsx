import type { FunctionComponent, PropsWithChildren, ReactNode,  } from 'react';
import './Layout.css';

type LayoutProps = PropsWithChildren & {
  title: ReactNode;
  formSlot: ReactNode;
}

export const Layout: FunctionComponent<LayoutProps> = (props) => {
  return (
    <div className='Layout'>
      <h1 className="Layout::Title">{props.title}</h1>
      <div className='Layout::Form'>
        {props.formSlot}
      </div>
      <main className='Layout::Main'>
        {props.children}
      </main>
    </div>
  )
}