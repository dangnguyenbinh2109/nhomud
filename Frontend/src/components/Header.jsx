const navItems = [
    {name: "Về chúng tôi", href: "/about"},
    {name: "Sản phẩm", href: "/lession"},
    {name: "Báo giá", href: "/contact"},
    {name: "Hướng dẫn", href: "/"},
]

export default function Header() {
    return (
        <header className="fixed w-full z-100 bg-white">
            <div className="container flex items-center justify-between">
                <a href="/">
                    <img src="/images/logo.png" alt="Logo" className="h-[90px] w-auto" />
                </a>
                
                <div className="space-x-10 text-gray-700">
                    {
                        navItems.map((item, key) => (
                            <a
                                key={key}
                                href={item.href}
                            >
                                {item.name}
                            </a>
                        ))
                    }
                </div>
                
                <a href="/login">
                    <div className="flex items-center justify-center bg-[#1b588f] text-white px-4 py-2 rounded-full
                        hover:scale-110">
                        <span className="text-sm">Đăng nhập</span>
                    </div>
                </a>
            </div>
        </header>
    )
}