import { NavLink } from './NavLink';

export const Links = () => {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/messages">Messages</NavLink>
        <NavLink href="/nfts">NFTs</NavLink>
        <NavLink href="/faucet">Faucet</NavLink>
      </div>
    </div>
  );
};
