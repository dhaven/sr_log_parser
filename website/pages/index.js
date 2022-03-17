import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import InputLog, { logDataAtom } from '../components/form.js'
import DeckList from '../components/deck_list.js'
import AuthorityChart from '../components/authorityChart.js'
import TradeChart from '../components/tradeChart.js'
import { useAtom } from 'jotai'
import { getDecks } from '../lib/classes'

export default function Home() {
  const [battle, setBattle] = useAtom(logDataAtom)
  let decksData = {}
  if(Object.keys(battle).length != 0){
    decksData = getDecks(battle)
  }
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <InputLog></InputLog>
      <div class="flex flex-row flex-wrap p-1 m-1 justify-between gap-1 w-screen sm:w-4/5 md:w-3/4 lg:w-1/2 max-w-lg">
        { 
          Object.keys(decksData).map((oneKey,i)=>{
            let subDict = {}
            subDict[oneKey] = decksData[oneKey]
            return (
              <DeckList key={i} deckData={decksData[oneKey]} player={oneKey}></DeckList>
            )
          })
        }
      </div>
      <div class="flex flex-row flex-wrap p-1 m-1 justify-center gap-1">
        <AuthorityChart></AuthorityChart>
        <TradeChart></TradeChart>
      </div>
    </Layout>
  )
}