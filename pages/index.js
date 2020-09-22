import { useEffect, useState } from "react";
import { connect } from 'react-redux'

import Link from 'next/link'
import Router from 'next/router'

export function Home({privateKey}) {

  useEffect(() => {
    if(!privateKey){
        Router.push('/settings')
    } else {
      Router.push('/wallet')
    }
  });

  return (
      <>
      </>
  )
}

const mapStateToProps = (state) => {
  return {
    privateKey: state.key.privateKey,
  }
}

export default connect(mapStateToProps)(Home)