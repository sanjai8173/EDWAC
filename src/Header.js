const Header = (props) => {
    return (
        <header className="Header">
            <h1>{props.title}</h1>
            <p>{props.slogan}</p>
        </header>
    )
}

export default Header