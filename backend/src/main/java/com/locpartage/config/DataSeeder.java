package com.locpartage.config;

import com.locpartage.annonce.Annonce;
import com.locpartage.annonce.AnnonceRepository;
import com.locpartage.categorie.Categorie;
import com.locpartage.categorie.CategorieRepository;
import com.locpartage.message.Message;
import com.locpartage.message.MessageRepository;
import com.locpartage.reservation.Reservation;
import com.locpartage.reservation.ReservationRepository;
import com.locpartage.reservation.ReservationStatut;
import com.locpartage.user.Role;
import com.locpartage.user.User;
import com.locpartage.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Seed peuplé à partir des maquettes Stitch :
 * - 8 catégories (3 avec image Stitch CDN, 5 picsum)
 * - 10 utilisateurs avec avatars réels
 * - 17 annonces (titres, prix, photos provenant des maquettes Stitch)
 * - 3 réservations (état dashboard)
 * - 6 messages (3 fils de messagerie)
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final CategorieRepository catRepo;
    private final UserRepository userRepo;
    private final AnnonceRepository annonceRepo;
    private final ReservationRepository resaRepo;
    private final MessageRepository msgRepo;
    private final PasswordEncoder enc;

    public DataSeeder(CategorieRepository c, UserRepository u, AnnonceRepository a,
                      ReservationRepository r, MessageRepository m, PasswordEncoder e) {
        this.catRepo = c;
        this.userRepo = u;
        this.annonceRepo = a;
        this.resaRepo = r;
        this.msgRepo = m;
        this.enc = e;
    }

    /* ============================================================
       Image URLs (extraites des maquettes Stitch)
       ============================================================ */

    // Catégories — images Stitch CDN
    private static final String IMG_CAT_BRICOLAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDRxxomZjlWsXhWyn0rko2UqZfG7hQbETaCcfKW2rPoxiwzq04lJ7Vu71y0e2XkbSpzd9IgcObnbWhmyzjyNBr2nXXCmAgFhfGvfWSs_PZj5lo_ZTJGik7JuOJblN0ZWNiv1Kci6v1DSLvv6UyDshT6y9r38LQ9RSg0Z6-aIFfHVtDtVw8WERx4B1hbwloUbZAYyHouWFqa5EcLAnPs5MDwyB5zGpmso5zsJsb0pI2LdyvyfTHi6ir7rf-KkNplwUAEZRNbYbM_vo1";
    private static final String IMG_CAT_JARDINAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCLiYTjg0t16VZXwe5wA05vRzF_14tRsJgPG7D53Vxdzz0c9_LyZtfrtc8-bLOORDXZNkck3jcIil_hScx8hxF1HNqcKl6KoYihVtSDZjYGaU-tokMlP-tUTO3jJYPygXQM1tVzmP1eDj27pGRcLuxgjQri9e_Gv7E1Bb6qe516IJXyl6X2LqMuF5pzpmMpv4My8knkVk81m446zqO69CQY8CQQbuU_kdheuBG5YpsLp8RrGvWx5UpUdD2E40cgyNjQbIgzBTInBuE-";
    private static final String IMG_CAT_MULTIMEDIA = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2HWavojSfOAqeUMFICd7uTlAqmDlhw3glW8o-p6sGDcHiOgW8QL2u4I62kk98nJacrkEn4oax5tbWRpls5BR_h-tEHHot96WnX7ORpubjykghsZA19jC-h_paatGCnATIvvVYD3JGHJGgiuYYNDTAPALnVTin9vaZdwXM3LH2PuAsQRsTuu_VzlQgtxeDaz5KMQixJW73aE3rkYHcjE-uHOLoST4jhejKU1hmSpOQnafyQEjRgAenWM2ju3H3Tflqu3Nowd5SncRW";

    // Avatars utilisateurs — Stitch CDN
    private static final String AV_MARC_ANTOINE = "https://lh3.googleusercontent.com/aida-public/AB6AXuC_t3o1vijqqSS0huAX1IHQazJqo0Sw9LQcqehFTt1p7XMoraChboLDxbLcT3ak5Rq_jSqC23BrW8GuKC0M3j7LK0NcU23aBElmVe_F1xASm2EwCKLr53getXDDGCE2y2mTq_o9joJKxh7dPyQiem1whq6rMNyQh_-gzX844cWp41JZdaNLxWrtXbnPzTDWDvQNSG4Ny8LpGe_JGfVnk1IewtWPTH4ICezRdhdDbZ4vHczg7lodihqPGoz7Rn_bdRlaOzO8VeQhqQnx";
    private static final String AV_MARC = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjugnEOKvf-RHHXDAORAfttdc_n-nBRAzpTJLRGe5XV3XfVrMhcYvwpSkaQo10R8qMudH8qqcogoWF7gS--VKhbIOA4SH32HROVI6VScQLmsyoT6syoI0HN8rq93hlhF3yFqCRgCTO7O5VDEDSuBHy4vlQDNQg-ACXi34HkGg21dX8CMHbIkq58VFKO5G9If5X42GXKBQTRSeSTDux9coltr1j88y2lswqodRlHEfWu-8Eoa975oESG_fro5xUumilX4_WjjYZaFf5";
    private static final String AV_JULIE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDF9cHCqx0Q_9CRFVe6Hc5cw6zcItNxVkgT9tq4agbFRaazlMWCEF_bOXDD7_63_7jCUvCB7mF_sc_d2GkqyQz_21ZKWPnZsNOa34ev2JB4pQqXO6rk2dTn8FRLrYTjdUeNHF5mIcw1wKYMWHRJeoVFmeLWwUjgQt98Bwr-E_Y3nzLrTbG-r6Bogcq2u2RWHmCRPnXU4FK7JVvVhXYUuidWJfeoz33OGlBX3aHOrFgj7STxiKutnW3b2ahNg9Zm_Xz7gpulleyd2zF6";
    private static final String AV_THOMAS = "https://lh3.googleusercontent.com/aida-public/AB6AXuCkkyYgLt9jL2p0FPt_6u5jrlDLx5qqGA0US4hD1riVlsjeOGgkG_ocr2uesujk5nnbiSlwj5sa3QdSlUEum_QSNwl0ttvRIV5nci8PcOQYaRMnUU7CLxucxQLb4UWnvWPxLYsFMUCpQvSfnTh97jalNf4E0u7pARJSJXLaZlxIaDp1bn4MuW4WBT7mr7JGlHpMwrE8bzk3Qd0Ij9CtNetmX-CR2Hs1bb9PkQIlr3KeMDF6JI2aVFwC-lBtKrxn-5gCijr6eGxxn3l3";
    private static final String AV_SOPHIE_B = "https://lh3.googleusercontent.com/aida-public/AB6AXuAGRfnV5z7NWG2gCfeTCGnXrDxPecGDpNUTV2SNFGjNzxL0SXyi25NlVNn1U1xv8ldEwuY4dqjZGLtFD9fdyTClTvyiKID7DaSHZe2PRDMBwCNWE2wVxpFX9SCWR3AFsU4en3N21inHinqVkuM9qXbo14ZCPeSW--qlj7ZkA3396uq60_OGF31zWObIXJ143914newD7MvTM0snLTIHXNbBYaU0flFcFLzfLGKiEEFGuQbEKI1NBDBJp5XfUgehGTk5-G2-a6CUSsY-";
    private static final String AV_JULIE_T = "https://lh3.googleusercontent.com/aida-public/AB6AXuDXjT5jsgHBuaKsTN11g20qvEOkugfQDv5IT-1G-xHFSPpOdQ7KMyzUAJE-dD23tM48QxxnY0qvSyjuPo0_5uanSGNVrt53QkjZeMe2SP74VHuC3cYgAN2gNZZzIeK4PUWlsUoKyvlZlqqYV9adNBQdo4Wpi0cPk7C9SMF7DCbXVGapql5YBWkYEMcfzuhDOgyjFvjdD7emr8raG1nPavAWdCuAf42zmiibSmACkrLYa2GX7SlPIe2qdfYb9Jc3BCB_Au1nL7xaGuQW";
    private static final String AV_MARC_ANDRE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDUdGe7arL9SKlLUxlDYN7nYM50XVCf22SEWZ2ISQUHnsBQVIs9ng6ZwP1DCWjKvPT0Ryu1_vUuPuZiNHzikzcV0p7P22bmZX8Q4WreBYF2F0vBSIzYTWQehyyJWXBNnxiac4wc7tXaFanHk4YjTEJuH7Rv8qA0La69tm9gjoPKzo13A76_g7z7qFl_eObvVnuTPkZ8ejk68e2xU7Reg4QHMWzlT6mEss0X9nTnC2vjjDJT5H_iRGB7JjifIIBGcVGO8JpmQNqTdTtp";
    private static final String AV_SOPHIE_L = "https://lh3.googleusercontent.com/aida-public/AB6AXuDmYOpE-X32RHUzVrCdHc12w-tp3RNDQRi_7ORDZMakHULlB_c7ABaXmZdSAC9ZB9o1qI8hZhZQrPaiMdcHo-7uYr7Z2G4EdPSnDN-P9kwC0cPkYMMuV_JFTgCy4mTuDJ3j5OnuXNEDB7d72R3tEt7kXNpZbKz2MQM5UJwKK1je0CASMOPSjJmlRlKSJYJKnlRF3LIyL1bAtkluakFcKR0WPJphOgeUHIyy0WYliUoI-EOI683JP8YQ1Xi7qxViPi9yFi9lTwp5Gi86";
    private static final String AV_JEAN_PHILIPPE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAdJVj6oJntkSQhGWRF1V8aZIxwnnMB6PL3_H7W67QOaMd101xAujpRmHTrmLk-4GK8_mlEIWZsnPxR1JJa9rBZRUNUVBqGbCCS4ReD0wFjXtG7AvstOEnQ7fltot_RYc0vHiMamsI9v17etnwK_DRqvQWTFbweovfXJZ-rPJUEtl67uTiWmBF51_8PpF9T3n839aEfPtiRBLgT87R-XoEH3dlfgndBNEnCZ4FXirjX57NOfwP44QnqV8RZro6cUj8e7ckcORzykFZw";
    private static final String AV_MELANIE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDjdHCU49p_SF3Grd0L11NYzp5bPyy8AyVEobMthQhhxvcqa0fE2Qs27KKTgx2OOJLG0jI9SuwDLiWGeqIkAUYRz8RuESfrlAMdLKUUOUbm74BID6xuzJltO1ZYm5n7DTHKlWkmj7v1duI_S7v-WFiH6g5Px7KZ51gOGZJIitOm5AjYr9YFW6POhV49K2ALQGgVITmK7wtcilcIttE8VOhi0jgfb2l_hweHRIOVxJZP4nuVJB-u3ew5cx7rmXpJtLGKVQknUCfJwAPa";

    // Photos annonces — Stitch CDN
    private static final String IMG_PERCEUSE_BOSCH_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuD8q4ucdUvBGo-lk4pmB9EWVHf3I1F9NnCBqBLtc4TfaxUNd7h29Kt1GJouGXxfRPXsmtUB7sxz-OQ6MnHYz_hfa-MlAHs3Qkjoog8Q2Z2OJNi3i0IPRHKIjUWAVhDRHM3rVnek3e64NBoaNQpxPe2U_1kJwBmvPTEyC0JppwVuPnr0TtLPuVWSCvLJJHuHbXq6cuJWmdp0RNEy5CZR8o8Qh1iQ7HTzI8K0xbVtMFsL4nB8-4G4madB0Saj-9J9PS0ZxszwEhyLPQkz";
    private static final String IMG_PERCEUSE_BOSCH_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCsXqYMizQBgfkd1xZP69Q5MBCYUnnWWBstgUTAw9w_JL2126_sfMghDwrtAY2KlUEHXL6D8slkmeaCNpn5ZFEiN1lOfz75vt8sKdx6Uv6FPvqVAPZhCucF50wZV00hqgZjj74qWT6LoXCN-pNy0_313Bhz7TXhrWxBvgYUybGmEo17ykiE2PGJG973TFzQHtKSAduQ-G4TbxSsUOblcEWNBgsdiOkl_61DSdWoSGgzfGkI0p11biE1aIsukCh6CSeM-NTTlCZtCHdI";
    private static final String IMG_PERCEUSE_BOSCH_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAvf9G8BqnWuGEBDhaIFBNXI5AR3s8mcb9uqGXcN9LDj_q_dSXeL9u7MtPtwt-cgZFqaeZvjUAChtlqUR_McFEf4UKG-wxbN1CT_H4i-biLVZscgT89l2t_st6ZbSYahMwZlnDIAzDsVXNmY59Y9CXPQjxfGoPEa5mKNGD5MaVpcPgTLzRSQAA-WLQY1xhC2HeR-z1CbZ91yK6rbb8467pm4S5-UbAjCghlJGLRXfeDNdC9phoBc6Jez5cG0uWLS0vWiXYl6gBDcAvM";
    private static final String IMG_PERCEUSE_BOSCH_4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuAU0AUKZkyyysIAehmZJ3ApoVtRloQaMOMsbdS3UY44Y069tF9UNP1xR_9UcSVe7e0BosZMjpgZZzWbxrYA703c-qM845Phfax0ce0Dss3b24miOXc5IjvEV5vi50iCQF2-S1zEsizn_oIA6ryEf2Zbv35jB6hsNhs1Os1x7vbnKkFMV_CerSRq_otZfwv4p7JzXbsSHJxS0YewsYdDQmn1_0J7yB_jgAHBL4LbOqITvpmw7BpSaI6TCmm5OD_ovdwBm4Cya2KBqwws";

    private static final String IMG_PERCEUSE_PRO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBYCxo8wgzh-WNn1GcJdgmClgeABsHcsOPMIL_SDZy6Pj8GVHYq_aJ-Cbf5lNBi8zI9Mw7N54VIwjvGkhgc3kQDWfFHYvqdKK58tOcfYy4e5tl2_joBSrihTOYV7nknZ0rjNyV5-YfxpBLL8ZZihCSg44pBnsu2PcGb6wFPGn3ycp9PqxdG1ZE_UJi4xzNFt2mJX4Y3Kv5bf7RLu-crfu_vJDLS1fVN_8egBU1m59FNwPbLrPYr_DaU2_AZY6Pkw9UDRtK0hgziDuuX";
    private static final String IMG_PROJECTEUR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDDmFIVQMLKJrujQHAKdxflq-OU0yvwRmtEbOXWc6yFY58Eieu4tDTQOv3CXvTRT55hZW-2LfSm7gzSCbLblZuahqBARUh0zg4Yy5r_D_BaL7j_bp0DEUtX641cVdO3XGMvtwP-PQXwajHFnwYJeK8-gCap3ce-jZOc-9vMSTasCf1EGDDUt_R2zj7bVIiufZUOUV-YxknPbSnG_5Pg7UbLbzpHFARMJs5Oc-wPVtMLHGmyvqmOXaaM-PnuW9e7jIZnoQ8GEcQcINx1";
    private static final String IMG_KITCHENAID = "https://lh3.googleusercontent.com/aida-public/AB6AXuBsNWMZXTrwylOWVosClmZO3jAg7Bv0JCM1cq0LWEStqi3CZ4PZeXidp9a1i5JUu1rgoY0yKczwPuSUx6a8HTACnl2SGEiRpv9bqSrMGIQck_kde4gkH5yW1Nva9hNodA4g_z8h7Q_k24ZgJWZHUWA_JLdvOEO3Q_yDGifRGi4BUxKgtHEUU4RmaARH1Tq8Zydmp2Us_kKxDZHZtmFjEHfqACWxBVnw-rqLrvMPgmECiutWY8oRK6YkbIDez7_mQK9PzQSvXUbE5xvZ";
    private static final String IMG_KARCHER = "https://lh3.googleusercontent.com/aida-public/AB6AXuCgKGASNt3WwUvPzh8poVo81G3L6rTkJ1GnjzffHWCEnMc6IdzGGWJ_xGu1VVrmUtLcU1V2eZATKQvulNiWkBn76ZpzQeoYflVn9pY_WmOteF2yhBQ7zf5DQViuGbRSlP7KUgECgPjvgCD0yMTrF7RL0q6_I6U2n49QfypW8UtwibXxEsP-mKjTb7_QujjWQree4X3Y2FoFjpjJO2kxAWLrgrA2-P5QjKkpMsX9GOJoPb4U_yquWpt4ygIu_hOBmC0mOj6CjBQiAe80";

    private static final String IMG_MILWAUKEE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCLMMP4BQMZ7riotAlmtVw3l7bzEpWwmNvHNSNzAnsNbdLSxzwewRz59In4nUUUGWlaeheAth6ykAQ73D3RdBsF3ymN_dYlmYrKA7j7EKtgnjrK6knOjpBD-B46OO4EsQXWSkGU9xI5ytElrqT9D1Zvj7FX1jRrMNVfNVevImgIrYH-0RTrJahBe5xQHTMwhbKLnLzglNg4QtjYHBTtq9_kyGeCjoNSqHc2xwEI6AaD5zamTi1YNcoLN4x2XX5x5d6oznWmbF_Asyqo";
    private static final String IMG_DEWALT_KIT = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwoPUVOCzYCr1SthoyOauBu1VDa_TNWxk0yW2I57CrpW1mrmWwQsjNBt3xsUA2xT2CcrWz9a9mUovWHlaPhiij5emUK72Hcl5m8Cc7Ctdi1YryMKa-a-4f17MXLc_fBOm8M9sGjQ19rNcAjfdWec6s3D8W6xBQqCvumca64ssY4Rt6IM4bq7ob1UDGxxoFHDsc0Wu7xlCL2kBDH0a1484srX7vK9mzP6eFa_q5kZAdjnWuOCNtQUVCByBA6wDIiqI4sElWDw1xDf_N";
    private static final String IMG_MAKITA_FIL = "https://lh3.googleusercontent.com/aida-public/AB6AXuBSdQK9uniiOgbuR8S7Pvjr5PMnQ_zqCBOn78FVEGcKm82pWMfNrMHC_a_ubIogEmZ-EUj_NVEZkKuPE2ZeYJ_Acp0hxbcTY0_BUDgkOx_ZjQtsWxBuum71MTj-s_zrdzobLe9svzrIBHt6cpC3HwOmGEebXeyaLI-qs3hykSRhSCe-_iXWQYgESCNNkTnHJlzmb5jC0Zhd7J8rIa1-NjJ-wE4yxnqXxc-WvKp82UA2eiGY2ZbRGhOrQ4i7f9tJPbwQqzLBeor9rQxp";
    private static final String IMG_MECHES = "https://lh3.googleusercontent.com/aida-public/AB6AXuAbFzR1cgJ1n57Ta1XSya4-hk7SjKT0UMBngmlT6LiR1Z6Pc04Oyb2s-iy-jHIwYeP24w6WmZWvfuCF8D14HJnMaj9_1y2dJVIPMqi614Jql4qAietrd-BdlleYqCyUbJBmf5dQwFuqgdxYfrXYUzEqN2ZW8hIaNAjXzfOHEM0lIm4xnPnp67KFoF8IK-FtLerrjWsMYp_7ycrlUWe9Sa5f7Dc-QOfYllW2P6MibEwBUfCktHVq2JrCF2_ZtuP1UNi22zMqwXPJfMgI";
    private static final String IMG_RYOBI = "https://lh3.googleusercontent.com/aida-public/AB6AXuDP1phmxP2RTgyMmuW_TuABZDpGJvqHgKnS_ejmoWEUeC3FL2gqOhwJX0B5Ld5yv4p7gJ9rF_84Lgxbp4r06IPwEidIWC2-Gp1cZyzlScHsT5HpGT09ZThjbd4K6d57TQUZmiEPNn2hQ-_fBRTBzYaS92zNjJOBykAEMV7fFYhvQNO4PRFcWbLopg9PUMGelXaNBS_UOrl6QEkvb2hqDrVVETWV3x6UtONT_eVwkgOo_WOgbPD_Vll-NVrcAs9e3ip1aMtVT6iRUUUR";
    private static final String IMG_DEWALT_COMPACT = "https://lh3.googleusercontent.com/aida-public/AB6AXuD20LDd-sLKF-A4KfXSThGgu4XZnK18W01RsdgFHIqFT2l1VKUkqt5EFoEMdzchuEn0Osc9tCYyK_eMBBzsaJ1NHIn4IHGG-raGt8OtflxrgY2ZKOb3PwZhjZ-Z14YWgG-QMDbOxhjaJ5WbmLiOOgKlPl2EkgmTZF9rvn14PkF7lTcMEkhwIlBQxg_0k7bvifGTzSgYtm8R7SBu2YSAwhM7hZMOxwDHDx91BmzGONrxjORYr98Wjh-4PMPE8mtvZhg_OUP-LIx-xJf6";
    private static final String IMG_PERFO_MAKITA = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0hGRjB9uFOU9JMxB8fxv9-6D2quzCHmm-gHrzG4GFPs650LDhz2E5L-melUf_FSXqoHtpUvFZAtQY4FvKdjlenUCrsxohg4XGLYRJ7meSLfw2vekIsSDva5zi0kNbWk7msII-BqJ-Olil56nxWlJfHddIC1C1FWGSpw-iFAdOF-LPm_hmQb2PiAOH3DZ3XxTmOkJ9MInT303uuWD2gNIff9dH3SpCbgzQExOhGLWTVHEQaPGBC4btcWEp";
    private static final String IMG_PACK_MILWAUKEE = "https://lh3.googleusercontent.com/aida-public/AB6AXuD7DoeNcR6mSVhEYd0TPQjKVGtUaWY-sO9op1xX82SBz5rCgEE2nmj3AD2v_HYvlOsDtLpgUhe_OE-BJVH8YwdY01nvTtur0WpsTnThqwAB1s7sz-UPnHS6Rk8zDowiGpzTqowMjIHlN_o7Wd2EMziu7wFIaGe9tKMvVEJ3WQANqhxDPz7o8PleVjep_es-7zpgRdqsMsk8KD1ACGA5sc3QjqM-sKgKBYNPDUOPxobzkTEyF3iRfyZmuKzcjOjGcruwWUit6z0psa-k";
    private static final String IMG_VISSEUSE_RYOBI = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMmIZuFLi_L4v4rcWp3i9PMcg7TxuuqusP8ZbgzDxZA_YNDTFa6GsBzK0IcrpVs7hL0rhoWNZpDXOcwLZeTRGyfTZYzgAqwRFGa7FdqI1QYXQybLXDTcTZYH86LGdNVPtZuqkqcFjXiWWHFoUP4ZcnxyUcT7RkKVbGnL_5rab1hTzkhGaDDmMuy6lsHJ1pbFghs_TbhY-Fm3b4eVQtanbYvWoacR3_HSe4_sittu3d1QdybMovq3GddKj03F8iuY33mFCAVtu-vkMV";
    private static final String IMG_NETTOYEUR_HP = "https://lh3.googleusercontent.com/aida-public/AB6AXuARU-g-P7vvusFTo9nqLLvsyPp4kzmlqRpQ5IK6iCUfdCWG2FaRaymGageZVD0QBWp0rdOPLYAWev4-E_n7iZJvr9OAovqPfBTelDb4q_dOr1I1NXOs9ZChBT7VhoSIj3hFtVIfm8op0X3mr3I-aiqNZEcEmoJfzjIGH5DhipILdU_0n3XjkvRTLVQ5XoZdsXI3EroiqsnrKX_OYx88tpnklUOoUEsxdYHzJWt33ARJ2rUObxZsB9r9PyCSGxZRQYLZf-L_IGKp6tSb";
    private static final String IMG_PEINTURE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUnuBhOkfBjm07OAhGhUCVglIsWtk4sTREGcc-2VbnVQMv3AbCbQ2W1XXBm7zp-gQVfPpVbrFdn8q72YFwDCYWujUk5Ln-3_16kZ5rg0IxRB2_ziKdIbttBaZR5jLE9zp7-EPKtoSMTgTKw0FFGWDiEYzrMDxkbt7yeDll_OGpIjyxoE9oUpswz66El5vV6cDTobRVhLqgw7xEk60-5ljuMhFhrS0iwge05rMyrPxwf6ilikjWecTNwGE2G6kVz8sixzeenwVia4wo";

    private static String pic(String seed) { return "https://picsum.photos/seed/" + seed + "/800/600"; }

    /* ============================================================ */

    @Override
    public void run(String... args) {
        seedCategories();
        Map<String, User> users = seedUsers();
        if (annonceRepo.count() == 0) {
            seedAnnonces(users);
        }
        if (resaRepo.count() == 0) {
            seedReservations(users);
        }
        if (msgRepo.count() == 0) {
            seedMessages(users);
        }
    }

    /* ------------------------------------------------------------
       Catégories
       ------------------------------------------------------------ */
    private void seedCategories() {
        Map<String, String> cats = new LinkedHashMap<>();
        cats.put("Bricolage",      IMG_CAT_BRICOLAGE);
        cats.put("Jardinage",      IMG_CAT_JARDINAGE);
        cats.put("Multimédia",     IMG_CAT_MULTIMEDIA);
        cats.put("Sport",          pic("sport-bike"));
        cats.put("Camping",        pic("camping-tent"));
        cats.put("Cuisine",        pic("cuisine-kitchen"));
        cats.put("Évènementiel",   pic("evenement-party"));
        cats.put("Transport",      pic("transport-scooter"));

        cats.forEach((nom, url) -> {
            Categorie existing = catRepo.findAll().stream()
                    .filter(c -> c.getNom().equals(nom))
                    .findFirst().orElse(null);
            if (existing == null) {
                catRepo.save(Categorie.builder().nom(nom).icone(url).build());
            } else if (existing.getIcone() == null || !existing.getIcone().startsWith("http")) {
                existing.setIcone(url);
                catRepo.save(existing);
            }
        });
    }

    /* ------------------------------------------------------------
       Utilisateurs (avec avatars Stitch)
       ------------------------------------------------------------ */
    private Map<String, User> seedUsers() {
        Map<String, User> map = new LinkedHashMap<>();

        if (!userRepo.existsByEmail("admin@locpartage.qc")) {
            userRepo.save(User.builder()
                    .prenom("Admin").nom("Loc'Partage")
                    .email("admin@locpartage.qc")
                    .password(enc.encode("admin1234"))
                    .ville("Montréal").codePostal("H2X 1Y4")
                    .avatarUrl(AV_MARC_ANTOINE)
                    .role(Role.ADMIN).active(true).build());
        }

        map.put("marc-antoine", ensureUser("marc-antoine@locpartage.qc", "Marc-Antoine", "Dubois",
                "514-555-0101", "Plateau Mont-Royal", "H2J 1A1", AV_MARC_ANTOINE));
        map.put("sophie-l",     ensureUser("sophie.l@locpartage.qc", "Sophie", "Lavoie",
                "514-555-0102", "Rosemont", "H1Y 2B3", AV_SOPHIE_L));
        map.put("jean-francois",ensureUser("jf@locpartage.qc", "Jean-François", "Tremblay",
                "514-555-0103", "Verdun", "H4G 1M5", AV_MARC_ANDRE));
        map.put("isabelle",     ensureUser("isabelle@locpartage.qc", "Isabelle", "Beaulieu",
                "514-555-0104", "Côte-des-Neiges", "H3T 1Y3", AV_MELANIE));
        map.put("david",        ensureUser("david@locpartage.qc", "David", "Therrien",
                "514-555-0105", "Westmount", "H3Y 1V8", AV_MARC));
        map.put("marie-eve",    ensureUser("marie-eve@locpartage.qc", "Marie-Eve", "Côté",
                "514-555-0106", "Ahuntsic", "H3L 1Z3", AV_JULIE_T));
        map.put("julie",        ensureUser("julie@locpartage.qc", "Julie", "Tremblay",
                "418-555-0201", "Québec", "G1R 2L3", AV_JULIE));
        map.put("thomas",       ensureUser("thomas@locpartage.qc", "Thomas", "Dion",
                "450-555-0301", "Laval", "H7N 1A1", AV_THOMAS));
        map.put("sophie-b",     ensureUser("sophie.b@locpartage.qc", "Sophie", "Bouchard",
                "450-555-0401", "Longueuil", "J4K 1B3", AV_SOPHIE_B));
        map.put("jean-philippe",ensureUser("jp@locpartage.qc", "Jean-Philippe", "Roy",
                "514-555-0501", "Montréal", "H2X 2T8", AV_JEAN_PHILIPPE));

        return map;
    }

    private User ensureUser(String email, String prenom, String nom, String tel,
                            String ville, String cp, String avatar) {
        return userRepo.findByEmail(email).orElseGet(() -> userRepo.save(User.builder()
                .prenom(prenom).nom(nom)
                .email(email)
                .password(enc.encode("demo1234"))
                .telephone(tel)
                .ville(ville).codePostal(cp)
                .avatarUrl(avatar)
                .role(Role.USER).active(true).build()));
    }

    /* ------------------------------------------------------------
       Annonces (titres / prix / photos extraits de Stitch)
       ------------------------------------------------------------ */
    private void seedAnnonces(Map<String, User> u) {
        Map<String, Categorie> byCat = new LinkedHashMap<>();
        catRepo.findAll().forEach(c -> byCat.put(c.getNom(), c));

        Categorie bric = byCat.get("Bricolage");
        Categorie jard = byCat.get("Jardinage");
        Categorie mult = byCat.get("Multimédia");
        Categorie cuis = byCat.get("Cuisine");
        Categorie sport = byCat.get("Sport");
        Categorie camp = byCat.get("Camping");
        Categorie even = byCat.get("Évènementiel");
        Categorie tran = byCat.get("Transport");

        // === Bricolage (annonces extraites maquette détail + recherche) ===
        saveAnnonce("Perceuse à percussion Bosch Pro GSB 18V-55",
                "Cette perceuse à percussion Bosch Professional 18V-55 est l'outil idéal pour tous vos projets de rénovation. Robuste et puissante, elle offre un couple de 55 Nm et un moteur sans charbon (brushless) pour une longévité accrue et une performance constante, même dans le béton ou la brique. Louée avec 2 batteries ProCORE 4.0Ah, un chargeur rapide et un coffret de transport L-BOXX. Parfaite pour le perçage intensif et le vissage de précision.",
                "25.00", "150.00", "Montréal", "H2J 1A1", bric, u.get("marc-antoine"),
                IMG_PERCEUSE_BOSCH_1, IMG_PERCEUSE_BOSCH_2, IMG_PERCEUSE_BOSCH_3, IMG_PERCEUSE_BOSCH_4);

        saveAnnonce("Perceuse à percussion Bosch",
                "Perceuse compacte parfaite pour fixations murales et petits travaux du quotidien. Livrée avec batterie et chargeur.",
                "15.00", "80.00", "Plateau Mont-Royal", "H2J 1A1", bric, u.get("marc-antoine"),
                IMG_PERCEUSE_PRO);

        saveAnnonce("Perceuse Milwaukee Fuel M18",
                "Perceuse-visseuse haut de gamme Milwaukee Fuel M18 — couple monstrueux, autonomie 18V, brushless. Pour pros et bricoleurs exigeants.",
                "22.00", "180.00", "Rosemont", "H1Y 2B3", bric, u.get("sophie-l"),
                IMG_MILWAUKEE);

        saveAnnonce("Kit DeWalt 20V complet",
                "Kit DeWalt 20V MAX : perceuse, visseuse à chocs, 2 batteries 5Ah, chargeur, sacoche. Idéal pour rénovation complète.",
                "25.00", "250.00", "Verdun", "H4G 1M5", bric, u.get("jean-francois"),
                IMG_DEWALT_KIT);

        saveAnnonce("Perceuse filaire Makita",
                "Perceuse filaire Makita, puissance constante sans souci de batterie. Parfaite pour usages prolongés en atelier.",
                "12.00", "60.00", "Côte-des-Neiges", "H3T 1Y3", bric, u.get("isabelle"),
                IMG_MAKITA_FIL);

        saveAnnonce("Ensemble de mèches béton",
                "Coffret complet de mèches béton SDS, diamètres 5 à 16 mm. Indispensable pour percer briques et béton.",
                "5.00", "30.00", "Westmount", "H3Y 1V8", bric, u.get("david"),
                IMG_MECHES);

        saveAnnonce("Perceuse Ryobi 18V One+",
                "Perceuse-visseuse Ryobi 18V One+, compatible avec toute la gamme Ryobi One+. Batterie + chargeur inclus.",
                "10.00", "50.00", "Ahuntsic", "H3L 1Z3", bric, u.get("marie-eve"),
                IMG_RYOBI);

        saveAnnonce("DeWalt DCD791 Compact",
                "DeWalt DCD791D2 perceuse-visseuse compacte 20V MAX, moteur brushless XR. 2 batteries 2Ah.",
                "22.00", "150.00", "Montréal", "H2X 2T8", bric, u.get("jean-philippe"),
                IMG_DEWALT_COMPACT);

        saveAnnonce("Perfo-burineur Makita 18V",
                "Perforateur-burineur Makita 18V LXT, fonction percussion + burinage. Pour gros travaux dans béton.",
                "35.00", "300.00", "Rosemont", "H1Y 2B3", bric, u.get("sophie-l"),
                IMG_PERFO_MAKITA);

        saveAnnonce("Pack Milwaukee M18 Fuel",
                "Pack complet Milwaukee M18 Fuel : perceuse + visseuse à chocs + scie sabre + lampe. 3 batteries.",
                "45.00", "400.00", "Westmount", "H3Y 1V8", bric, u.get("david"),
                IMG_PACK_MILWAUKEE);

        saveAnnonce("Visseuse à choc Ryobi HP",
                "Visseuse à choc Ryobi 18V HP, couple 250 Nm. Idéale pour boulonnerie et serrage rapide.",
                "18.00", "100.00", "Verdun", "H4G 1M5", bric, u.get("jean-francois"),
                IMG_VISSEUSE_RYOBI);

        // === Jardinage ===
        saveAnnonce("Nettoyeur haute pression 3000 PSI",
                "Nettoyeur haute pression 3000 PSI, idéal pour façades, terrasses, voitures. Tuyau 8m + 3 buses.",
                "30.00", "200.00", "Montréal", "H2X 2T8", jard, u.get("jean-philippe"),
                IMG_NETTOYEUR_HP);

        // === Multimédia ===
        saveAnnonce("Vidéoprojecteur 4K Cinéma",
                "Vidéoprojecteur 4K HDR pour soirée cinéma à la maison. 3500 lumens, HDMI x2, Bluetooth. Toile 120 pouces incluse.",
                "25.00", "300.00", "Québec", "G1R 2L3", mult, u.get("julie"),
                IMG_PROJECTEUR);

        // === Cuisine ===
        saveAnnonce("Robot pâtissier KitchenAid",
                "Robot pâtissier KitchenAid Artisan 4.8L, 10 vitesses. 3 accessoires : fouet, batteur plat, crochet pétrisseur. Couleur rouge empire.",
                "12.00", "250.00", "Laval", "H7N 1A1", cuis, u.get("thomas"),
                IMG_KITCHENAID);

        // === Évènementiel ===
        saveAnnonce("Kit de peinture chevalet pro",
                "Kit complet peinture artiste : chevalet bois pliable, palette, 24 tubes acrylique, 12 pinceaux. Pour ateliers ou cours.",
                "20.00", "100.00", "Québec", "G1R 2L3", even, u.get("julie"),
                IMG_PEINTURE);

        saveAnnonce("Nettoyeur vapeur Kärcher",
                "Nettoyeur vapeur Kärcher SC3 EasyFix. Désinfecte sans détergent, idéal cuisine, salle de bain, sols.",
                "20.00", "150.00", "Longueuil", "J4K 1B3", cuis, u.get("sophie-b"),
                IMG_KARCHER);

        // === Sport / Camping / Transport (picsum fallback) ===
        saveAnnonce("Vélo de route carbone Shimano 105",
                "Vélo route taille M, groupe Shimano 105 11v. Parfait pour balades et entrainements sportifs.",
                "25.00", "500.00", "Plateau Mont-Royal", "H2J 1A1", sport, u.get("marc-antoine"),
                pic("velo-route-carbone"), pic("velo-route-carbone-2"));

        saveAnnonce("Kayak gonflable Sevylor 2 places",
                "Kayak Sevylor 2 places, pagaies + pompe + sac de transport. Capacité 180kg.",
                "30.00", "150.00", "Longueuil", "J4K 1B3", sport, u.get("sophie-b"),
                pic("kayak-sevylor"));

        saveAnnonce("Tente 4 places + sacs de couchage",
                "Tente Coleman 4 places + 4 sacs de couchage 3 saisons + matelas gonflables. Kit camping famille complet.",
                "18.00", "120.00", "Ahuntsic", "H3L 1Z3", camp, u.get("marie-eve"),
                pic("tente-camping"), pic("tente-camping-2"));

        saveAnnonce("Trottinette électrique Xiaomi Pro 2",
                "Trottinette Xiaomi Mi Pro 2, autonomie 45km, vitesse max 25km/h. Casque + antivol inclus.",
                "18.00", "250.00", "Laval", "H7N 1A1", tran, u.get("thomas"),
                pic("trottinette-xiaomi"));

        saveAnnonce("Remorque utilitaire bâchée 750kg",
                "Remorque essieu unique 750kg, bâche imperméable + rampes d'accès. Permis B suffit.",
                "40.00", "300.00", "Verdun", "H4G 1M5", tran, u.get("jean-francois"),
                pic("remorque-750"));
    }

    private void saveAnnonce(String titre, String desc, String prix, String caution,
                             String ville, String cp, Categorie cat, User owner, String... photos) {
        annonceRepo.save(Annonce.builder()
                .titre(titre)
                .description(desc)
                .prixJour(new BigDecimal(prix))
                .caution(new BigDecimal(caution))
                .ville(ville).codePostal(cp)
                .disponible(true)
                .categorie(cat).proprietaire(owner)
                .photos(new ArrayList<>(List.of(photos)))
                .build());
    }

    /* ------------------------------------------------------------
       Réservations (extraites dashboard maquette)
       ------------------------------------------------------------ */
    private void seedReservations(Map<String, User> u) {
        User jp = u.get("jean-philippe");

        // 1. Nettoyeur HP — réservation confirmée (Jean-Philippe loue à... lui-même n'est pas idéal)
        //    Maquette : Marc-André L. propriétaire, JP locataire. Adapté : owner=david
        Annonce nettoyeur = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Nettoyeur haute pression")).findFirst().orElse(null);
        if (nettoyeur != null) {
            resaRepo.save(Reservation.builder()
                    .annonce(nettoyeur)
                    .locataire(u.get("marc-antoine"))
                    .dateDebut(LocalDate.now().plusDays(5))
                    .dateFin(LocalDate.now().plusDays(7))
                    .montantTotal(new BigDecimal("85.00"))
                    .statut(ReservationStatut.CONFIRMEE)
                    .messageOptionnel("Bonjour, je passerai chercher l'équipement samedi matin vers 9h.")
                    .build());
        }

        // 2. Kit peinture — en attente
        Annonce peinture = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Kit de peinture")).findFirst().orElse(null);
        if (peinture != null) {
            resaRepo.save(Reservation.builder()
                    .annonce(peinture)
                    .locataire(jp)
                    .dateDebut(LocalDate.now().plusDays(12))
                    .dateFin(LocalDate.now().plusDays(13))
                    .montantTotal(new BigDecimal("45.00"))
                    .statut(ReservationStatut.EN_ATTENTE)
                    .messageOptionnel("Atelier peinture prévu samedi, possibilité d'aller chercher vendredi soir ?")
                    .build());
        }

        // 3. Robot KitchenAid — terminée (historique)
        Annonce kitch = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Robot pâtissier")).findFirst().orElse(null);
        if (kitch != null) {
            resaRepo.save(Reservation.builder()
                    .annonce(kitch)
                    .locataire(u.get("sophie-b"))
                    .dateDebut(LocalDate.now().minusDays(20))
                    .dateFin(LocalDate.now().minusDays(18))
                    .montantTotal(new BigDecimal("36.00"))
                    .statut(ReservationStatut.TERMINEE)
                    .build());
        }
    }

    /* ------------------------------------------------------------
       Messages (3 fils extraits de la messagerie maquette)
       ------------------------------------------------------------ */
    private void seedMessages(Map<String, User> u) {
        User jp = u.get("jean-philippe");
        User julie = u.get("julie");

        // Trouver une annonce perceuse pour rattacher
        Annonce perceuseBosch = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Perceuse à percussion Bosch Pro"))
                .findFirst().orElse(null);

        // === Fil 1 : Julie Tremblay <-> Jean-Philippe (perceuse Bosch) ===
        msgRepo.save(Message.builder()
                .expediteur(julie).destinataire(jp).annonce(perceuseBosch)
                .contenu("Bonjour ! Est-ce que la perceuse Bosch est toujours disponible pour ce samedi ? J'en aurais besoin pour fixer des étagères.")
                .lu(true).build());
        msgRepo.save(Message.builder()
                .expediteur(jp).destinataire(julie).annonce(perceuseBosch)
                .contenu("Bonjour Julie ! Oui, elle est disponible. Je l'ai justement nettoyée hier. Vous pouvez passer la prendre dès 9h.")
                .lu(true).build());
        msgRepo.save(Message.builder()
                .expediteur(julie).destinataire(jp).annonce(perceuseBosch)
                .contenu("C'est parfait, je peux venir le chercher vers 10h si cela vous convient toujours. Le paiement se fait via la plateforme ?")
                .lu(false).build());

        // === Fil 2 : Marc-André Beaulieu (sophie-b mappée ici) — tente 4 pers ===
        Annonce tente = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Tente 4 places"))
                .findFirst().orElse(null);
        msgRepo.save(Message.builder()
                .expediteur(u.get("sophie-b")).destinataire(jp).annonce(tente)
                .contenu("Merci encore pour la location, tout était nickel.")
                .lu(true).build());

        // === Fil 3 : Sophie Lavoie — échelle / disponibilité ===
        Annonce visseuse = annonceRepo.findAll().stream()
                .filter(a -> a.getTitre().startsWith("Visseuse à choc"))
                .findFirst().orElse(null);
        msgRepo.save(Message.builder()
                .expediteur(u.get("sophie-l")).destinataire(jp).annonce(visseuse)
                .contenu("Est-ce que la visseuse est toujours disponible le week-end prochain ?")
                .lu(false).build());
        msgRepo.save(Message.builder()
                .expediteur(jp).destinataire(u.get("sophie-l")).annonce(visseuse)
                .contenu("Bonjour Sophie, oui elle est libre. Je vous confirme dès que vous validez la réservation.")
                .lu(true).build());
    }
}
